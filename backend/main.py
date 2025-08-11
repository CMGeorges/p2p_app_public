"""
Backend API for the P2P payment app (prototype).

This module defines a FastAPI application that exposes endpoints for:

* créer des utilisateurs (`POST /users`),
* déposer de l’argent sur un compte utilisateur (`POST /deposit`),
* transférer de l’argent entre deux utilisateurs (`POST /transfer`),
* récupérer le fil d’activité des transactions (`GET /feed`).

Les données sont persistées dans une base SQLite située dans le dossier backend. Le fichier
`database.py` encapsule toutes les interactions avec la base (création de tables,
insertion, lecture et mise à jour).  Ce fichier `main.py` se concentre sur la
logique API et la validation des données en entrée.
"""

from typing import List
import secrets
from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from datetime import datetime

from . import database

app = FastAPI(title="P2P Payment API", version="0.1.0")

# Initialise la base SQLite au démarrage
database.init_db()

class UserCreate(BaseModel):
    username: str = Field(..., example="alice")

class DepositRequest(BaseModel):
    username: str = Field(..., example="alice")
    amount: float = Field(..., gt=0, example=10.0)

class TransferRequest(BaseModel):
    sender: str = Field(..., example="alice")
    recipient: str = Field(..., example="bob")
    amount: float = Field(..., gt=0, example=5.0)
    message: str = Field("", example="dîner")

class TransactionResponse(BaseModel):
    timestamp: datetime
    sender: str
    recipient: str
    amount: float
    message: str

# In-memory token store for authentication.  Maps tokens to usernames.
TOKENS: dict[str, str] = {}

def get_current_username(authorization: str | None = Header(None)) -> str:
    """
    Extract and validate the Bearer token from the Authorization header.
    Returns the username associated with the token or raises HTTP 401/403.
    """
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
    token = authorization[7:]  # Remove "Bearer " prefix
    username = TOKENS.get(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return username

@app.post("/users", status_code=201)
def create_user(data: UserCreate):
    username = data.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")
    existing = database.get_user_by_username(username)
    if existing:
        raise HTTPException(status_code=409, detail="User already exists")
    user_id = database.create_user(username)
    return {"message": f"User '{username}' created", "id": user_id}

@app.post("/deposit")
def deposit(
    data: DepositRequest,
    current_username: str = Depends(get_current_username),
):
    """
    Déposer des fonds sur un compte.  L'utilisateur doit être authentifié
    et ne peut déposer que sur son propre compte.
    """
    username = data.username.strip()
    amount = data.amount
    if username != current_username:
        raise HTTPException(status_code=403, detail="Cannot deposit to another user's account")
    user = database.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    database.update_balance(user["id"], amount)
    new_balance = user["balance"] + amount
    return {
        "message": f"Deposited {amount:.2f} to '{username}'",
        "balance": new_balance,
    }

@app.post("/transfer")
def transfer(
    data: TransferRequest,
    current_username: str = Depends(get_current_username),
):
    """
    Transférer des fonds d'un utilisateur à un autre.  L'expéditeur doit être
    l'utilisateur authentifié.  Vérifie l'existence des comptes et le solde.
    """
    sender_name = data.sender.strip()
    recipient_name = data.recipient.strip()
    amount = data.amount
    message = data.message or "payment"
    if sender_name != current_username:
        raise HTTPException(status_code=403, detail="Cannot transfer on behalf of another user")
    sender = database.get_user_by_username(sender_name)
    recipient = database.get_user_by_username(recipient_name)
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    if sender["balance"] < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")
    # Update balances
    database.update_balance(sender["id"], -amount)
    database.update_balance(recipient["id"], amount)
    # Record transaction
    database.create_transaction(sender["id"], recipient["id"], amount, message)
    # Fetch updated balances
    new_sender = database.get_user_by_username(sender_name)
    new_recipient = database.get_user_by_username(recipient_name)
    return {
        "message": f"Transferred {amount:.2f} from '{sender_name}' to '{recipient_name}'",
        "balances": {
            "sender": new_sender["balance"],
            "recipient": new_recipient["balance"],
        },
    }

@app.get("/feed", response_model=List[TransactionResponse])
def get_feed():
    rows = database.get_feed()
    return [
        TransactionResponse(
            timestamp=datetime.fromisoformat(row["timestamp"]),
            sender=row["sender"],
            recipient=row["recipient"],
            amount=row["amount"],
            message=row["message"] or ""
        )
        for row in rows
    ]

# Routes pour l’authentification (inscription/connexion)
class SignupRequest(BaseModel):
    username: str = Field(..., example="alice")
    password: str = Field(..., min_length=4, example="secret123")

class LoginRequest(BaseModel):
    username: str = Field(..., example="alice")
    password: str = Field(..., example="secret123")

@app.post("/signup", status_code=201)
def signup(data: SignupRequest):
    username = data.username.strip()
    password = data.password
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")
    existing = database.get_user_by_username(username)
    if existing:
        raise HTTPException(status_code=409, detail="User already exists")
    user_id = database.create_user_with_password(username, password)
    return {"message": f"User '{username}' created", "id": user_id}

@app.post("/login")
def login(data: LoginRequest):
    username = data.username.strip()
    password = data.password
    stored_hash = database.get_password_hash(username)
    if stored_hash is None:
        raise HTTPException(status_code=404, detail="User not found")
    if stored_hash != database.hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = secrets.token_hex(32)
    TOKENS[token] = username
    return {"message": "Login successful", "token": token}

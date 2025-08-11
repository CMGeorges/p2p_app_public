"""
Backend API for the P2P payment app (prototype).

Cette API expose des endpoints pour créer des utilisateurs, déposer de l’argent,
effectuer des transferts et consulter le fil d’activité. Les données sont
persistées dans une base SQLite gérée par database.py.
"""

from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime

from . import database

app = FastAPI(title="P2P Payment API", version="0.1.0")

# Initialise la base SQLite au démarrage
database.init_db()

class UserCreate(BaseModel):
    username: str = Field(...)

# … définition des autres schémas (DepositRequest, TransferRequest, TransactionResponse) …

@app.post("/users", status_code=201)
def create_user(data: UserCreate):
    # Vérification et création en base
    # …

@app.post("/deposit")
def deposit(data: DepositRequest):
    # Mise à jour du solde
    # …

@app.post("/transfer")
def transfer(data: TransferRequest):
    # Vérification des comptes, mise à jour des soldes et enregistrement de la transaction
    # …

@app.get("/feed", response_model=List[TransactionResponse])
def get_feed():
    # Lecture des transactions et transformation en schémas
    # …

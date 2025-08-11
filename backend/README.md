# Dépôt (authentifié)

curl -X POST http://localhost:8000/deposit \
 -H 'Content-Type: application/json' \
 -H "Authorization: Bearer <votre_token_de_connexion>" \
 -d '{"username": "alice", "amount": 20}'

# Transfert (authentifié)

curl -X POST http://localhost:8000/transfer \
 -H 'Content-Type: application/json' \
 -H "Authorization: Bearer <votre_token_de_connexion>" \
 -d '{"sender": "alice", "recipient": "bob", "amount": 5, "message": "café"}'

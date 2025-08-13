# P2P Payments Québec — Portfolio

Prototype d’une application de paiements P2P avec **fil social**, **authentification**, et **cagnottes** (pools), inspirée des apps populaires à l’étranger (type Venmo) mais adaptée au contexte canadien/québécois.

## Fonctionnalités (MVP)

- Création d’utilisateur + inscription/connexion (token)
- Dépôt et transfert **authentifiés**
- Fil d’activité des transactions
- Cagnottes : création et contributions
- Mobile (React Native) : formulaires simples pour tester l’API

## Architecture (aperçu)

- Backend : **FastAPI** (Python) + **SQLite** (dev)
- Mobile : **React Native** (prototype)
- Sécurité : token en mémoire (démo), hachage SHA‑256 (prototype)
- Docs : diagrammes Mermaid (architecture, schéma DB, séquence)

## Démarrage rapide (backend)

```bash
# lancer l’API en dev
uvicorn p2p_app.backend.main:app --reload --port 8000
```

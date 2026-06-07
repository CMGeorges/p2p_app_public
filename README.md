# P2P Payments Québec — Portfolio

Prototype technique d’une application de paiements P2P avec **fil social**, **authentification**, **transactions**, et **cagnottes**. Le projet est inspiré des applications de paiement social populaires, mais présenté ici comme une base technique adaptée au contexte canadien et québécois.

> This repository is a portfolio prototype. It is not a production financial product and does not process real funds.

---

## 🎯 Portfolio Overview

This project demonstrates how a P2P payment experience could be structured from a technical point of view: API design, authentication flow, transaction records, activity feed, group pools, and a mobile-first interface.

The objective is not to present a ready-to-launch fintech product. The objective is to show backend/mobile architecture thinking, API documentation, product reasoning, and awareness of Canadian fintech constraints.

**GitHub description suggestion:**

> Technical prototype of a Canadian P2P payments app with FastAPI, React Native, social transactions, pools, and fintech compliance considerations.

**Suggested topics:**

```text
fastapi python react-native sqlite fintech p2p-payments mobile-app api prototype canada quebec authentication swagger openapi portfolio-project
```

---

## ✨ MVP Features

- User registration and login with token-based authentication
- Authenticated deposit and transfer flows
- Transaction activity feed
- Pools / cagnottes creation and contribution flow
- React Native mobile prototype for testing the API
- FastAPI automatic documentation through Swagger UI
- Mermaid documentation for architecture, database schema, and sequence flow

---

## 🧱 Architecture Overview

```text
p2p_app_public/
├── p2p_app/
│   └── backend/             # FastAPI backend
│       └── main.py          # API entry point
│
├── mobile/                  # React Native prototype, if present locally
├── README.md                # Project documentation
└── docs/                    # Diagrams or technical notes, if present
```

Core stack:

- **Backend:** FastAPI, Python
- **Database:** SQLite for local development
- **Mobile:** React Native prototype
- **API docs:** FastAPI Swagger UI at `/docs`
- **Security model:** prototype token flow, not production-grade auth

---

## ⚖️ Regulatory and Compliance Notice

This project is a **technical prototype for portfolio purposes only**.

It is not a registered money services business, payment processor, wallet provider, bank, credit product, or production fintech service. It does not process real deposits, withdrawals, balances, cards, bank accounts, e-transfers, or regulated payment flows.

A real Canadian P2P payments product would require professional legal, security, privacy, and compliance review before launch, including areas such as:

- FINTRAC / MSB registration analysis
- AML and suspicious-transaction monitoring
- KYC / identity verification requirements
- Privacy compliance under Canadian and Quebec privacy laws
- Payment network, banking, custody, and settlement rules
- Fraud prevention, chargebacks, account takeover protection, and dispute handling
- Secure authentication, encryption, audit logging, and production incident response
- Consumer protection, terms of service, and risk disclosures

This repository should be evaluated as a software engineering prototype, not as financial advice or a deployable financial service.

---

## 🛠️ Local Setup

### Backend

```bash
# Install dependencies according to the project environment
pip install fastapi uvicorn

# Run the API in development mode
uvicorn p2p_app.backend.main:app --reload --port 8000
```

Default local URLs:

```text
API:     http://localhost:8000
Swagger: http://localhost:8000/docs
OpenAPI: http://localhost:8000/openapi.json
```

### Mobile prototype

If the React Native mobile folder is available locally:

```bash
cd mobile
npm install
npx expo start
```

or, depending on the local setup:

```bash
npm install
npx react-native start
```

---

## ✅ Main API Areas

Recommended screens/endpoints to review in Swagger:

- Authentication / user creation
- Login / token flow
- Deposits
- Transfers
- Transaction feed
- Pools / cagnottes
- Pool contributions

---

## 📸 Captures

Screenshots and demo GIFs should be stored in `/screenshots` after the API and mobile prototype are launched locally.

Current status: screenshots are not committed yet. This section intentionally avoids broken image links until real image files are added.

Planned files:

```text
screenshots/swagger-docs.png
screenshots/auth-flow.png
screenshots/transaction-feed.png
screenshots/pools.png
screenshots/mobile-home.png
screenshots/mobile-transfer.png
screenshots/demo.gif
```

Recommended captures:

- Swagger UI at `http://localhost:8000/docs`
- OpenAPI schema or endpoint list
- Authentication request example
- Transaction or feed endpoint example
- Pool creation / contribution endpoint example
- React Native login or home screen
- React Native transfer screen
- 20-30 second GIF showing the API and mobile prototype flow

After real screenshots are committed, replace this planned list with Markdown image links.

---

## 🎥 Demo GIF Workflow

Create the screenshots folder:

```bash
mkdir -p screenshots
```

Record a 20-30 second demo locally, then convert it with FFmpeg:

```bash
ffmpeg -i demo.mov -vf "fps=12,scale=1280:-1:flags=lanczos" screenshots/demo.gif
```

Suggested demo flow:

1. Open Swagger UI at `/docs`
2. Show available API sections
3. Run or display an auth request
4. Show a transfer or transaction-feed endpoint
5. Switch to the mobile prototype screen, if available

---

## 🧪 Testing and Validation Checklist

Before presenting this project to recruiters:

- [ ] Backend starts locally with Uvicorn
- [ ] Swagger UI loads at `/docs`
- [ ] Main API endpoints are visible
- [ ] At least one auth flow can be demonstrated
- [ ] At least one transaction or pool flow can be demonstrated
- [ ] Screenshots are committed in `/screenshots`
- [ ] Demo GIF is committed in `/screenshots`
- [ ] README image links are activated only after files exist

---

## 🚀 Portfolio Positioning

Present this project as a **technical prototype** that shows fintech product thinking, API design, mobile-first architecture, and regulatory awareness.

Strong recruiter angle:

> I built a FastAPI and React Native prototype for a Canadian P2P payments concept. The project demonstrates API design, mobile workflow thinking, authentication flow, transaction modeling, group pools, Swagger documentation, and awareness of the regulatory gap between a prototype and a production fintech product.

---

## 📚 License

Portfolio / educational use.

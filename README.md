# Test Technique - Portail Mairie (Mbaling)

Ce repository est un test technique de portail web de mairie, avec un frontend Angular et une API Node.js/Express.

## Objectif du README

Ce document est volontairement technique et centré sur une chose: lancer le projet en local rapidement.

## Stack

- Frontend: Angular 21, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Donnees: stockage JSON local dans backend/data/db.json
- Auth admin: JWT

## Prerequis

- Node.js 18+
- npm 9+

## Structure utile

```text
mbaling-portal/
  backend/
    src/
    data/
    uploads/
    .env.example
  frontend/
    src/
    proxy.conf.json
```

## Installation

Depuis la racine du projet:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuration backend (.env)

Dans backend, creer un fichier .env a partir de .env.example.

Sur Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Sur macOS/Linux:

```bash
cp .env.example .env
```

Variables minimales a verifier dans backend/.env:

- PORT (par defaut 3000)
- ADMIN_USERNAME
- ADMIN_PASSWORD
- JWT_SECRET
- CORS_ORIGIN (http://localhost:4200 en local)
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO

## Lancer le projet en local

Ouvrir 2 terminaux.

Terminal 1 (API):

```bash
cd backend
npm run dev
```

API disponible sur:

- http://localhost:3000
- Healthcheck: http://localhost:3000/api/health

Terminal 2 (Frontend):

```bash
cd frontend
npm start
```

Frontend disponible sur:

- http://localhost:4200

Note: le proxy frontend redirige /api vers http://localhost:3000 (voir frontend/proxy.conf.json).

## Scripts utiles

Backend (dossier backend):

- npm run dev: demarrage dev avec nodemon
- npm start: demarrage standard

Frontend (dossier frontend):

- npm start: serveur de dev Angular
- npm run build: build production
- npm run watch: build en mode watch
- npm run test: tests

## Verification rapide

1. API OK si http://localhost:3000/api/health repond status ok
2. Frontend OK si http://localhost:4200 charge sans erreur
3. Les appels frontend vers /api doivent fonctionner sans CORS error

## Notes

- Le backend utilise un stockage fichier (JSON) pour simplifier le test.
- Les donnees initiales proviennent de backend/data/seed.json.
- Ne pas commit le fichier backend/.env.

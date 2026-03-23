# Test Technique - Portail Mairie (Mbaling)

Ce repository est un test technique de portail web de mairie, avec un frontend Angular et une API Node.js/Express.

## Objectif du README

Ce document est volontairement technique et centré sur une chose: lancer le projet en local rapidement.

## Stack

- Frontend: Angular 21, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Base de données: MySQL 8+
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

## Configuration Base de Données

**Important**: La migration vers MySQL est faite.

### Étape 1: Créer la base dans MySQL

Via phpMyAdmin ou ligne de commande MySQL:

```sql
CREATE DATABASE mairie_mbaling CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Étape 2: Créer les tables

Exécute ce script SQL dans phpMyAdmin (onglet SQL) ou en ligne de commande:

```sql
CREATE TABLE `actualites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titre` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `categorie` VARCHAR(100) NOT NULL,
  `date` VARCHAR(100) NOT NULL,
  `badge_class` VARCHAR(120),
  `bg_class` VARCHAR(160),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `conseillers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `responsabilite` VARCHAR(255),
  `ordre` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titre` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `details` JSON NOT NULL,
  `bgIcon` VARCHAR(80),
  `iconColor` VARCHAR(80),
  `borderColor` VARCHAR(80)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Étape 3: Importer les données initiales

Exécute ce script SQL pour remplir les données:

```sql
-- ===== ACTUALITES =====
INSERT INTO `actualites` (`id`, `titre`, `description`, `categorie`, `date`, `badge_class`, `bg_class`, `created_at`) VALUES
(1, 'Rénovation de la place centrale - Phase 2 lancée', 'Les travaux de rénovation de la place centrale de Mbaling entrent dans leur deuxième phase avec la création d\'espaces verts et de zones piétonnes modernes. Cette phase sera terminée d\'ici septembre 2026.', 'Travaux', '5 mars 2026', 'bg-orange-100 text-orange-700', 'bg-gradient-to-br from-orange-400 to-orange-600', '2026-03-05 00:00:00'),
(2, 'Inscriptions scolaires 2026-2027 ouvertes', 'Les inscriptions pour l\'année scolaire 2026-2027 sont désormais ouvertes. Rendez-vous en mairie muni des documents nécessaires ou inscrivez-vous en ligne sur notre portail.', 'Éducation', '28 février 2026', 'bg-green-100 text-green-700', 'bg-gradient-to-br from-green-400 to-green-600', '2026-02-28 00:00:00'),
(3, 'Fête de printemps - 20 & 21 avril 2026', 'La traditionnelle fête de printemps de Mbaling aura lieu les 20 et 21 avril 2026. Concerts, animations et expositions pour toute la famille sont au programme.', 'Événement', '15 février 2026', 'bg-purple-100 text-purple-700', 'bg-gradient-to-br from-purple-400 to-purple-600', '2026-02-15 00:00:00'),
(4, 'Conseil municipal du 10 mars 2026', 'Le prochain conseil municipal se tiendra le 10 mars 2026 à 18h30 en mairie. Les citoyens sont invités à assister à cette séance publique.', 'Institution', '1 février 2026', 'bg-blue-100 text-blue-700', 'bg-gradient-to-br from-blue-500 to-blue-700', '2026-02-01 00:00:00'),
(5, 'Plantation de 200 arbres dans la commune', 'Dans le cadre de son plan vert, la mairie de Mbaling plante 200 arbres sur l\'ensemble du territoire communal ce mois-ci. Un geste fort pour l\'environnement.', 'Environnement', '20 janvier 2026', 'bg-teal-100 text-teal-700', 'bg-gradient-to-br from-teal-400 to-teal-600', '2026-01-20 00:00:00'),
(6, 'Ouverture de la nouvelle médiathèque', 'La nouvelle médiathèque municipale ouvrira ses portes le 1er avril 2026. Un espace moderne de 800 m² avec plus de 25 000 ouvrages, espace numérique et salle de conférence.', 'Événement', '10 janvier 2026', 'bg-purple-100 text-purple-700', 'bg-gradient-to-br from-indigo-400 to-indigo-600', '2026-01-10 00:00:00');

-- ===== CONSEILLERS =====
INSERT INTO `conseillers` (`id`, `nom`, `role`, `responsabilite`, `ordre`) VALUES
(1, 'Pape Da', 'Maire', 'Administration générale, finances, sécurité', 1),
(2, 'Geralt de Riv', '1er Adjoint', 'Urbanisme & travaux publics', 2),
(3, 'Yennefer', '2e Adjointe', 'Éducation & jeunesse', 3),
(4, 'Bojack Horseman', '3e Adjoint', 'Culture, sport & associations', 4),
(5, 'Rick Garfield', '4e Adjoint', 'Solidarités & santé', 5),
(6, 'Jeanne d\'Arc', '5e Adjointe', 'Environnement & développement durable', 6);

-- ===== SERVICES =====
INSERT INTO `services` (`id`, `titre`, `description`, `details`, `bgIcon`, `iconColor`, `borderColor`) VALUES
(1, 'État civil', 'Toutes les démarches liées à l\'état civil de vos proches et de vous-même.', '["Déclaration de naissance","Mariage civil","Déclaration de décès","Copies et extraits d\'actes","Livret de famille","Reconnaissance anticipée"]', 'bg-blue-100', 'text-blue-700', 'border-blue-200'),
(2, 'Urbanisme', 'Toutes les autorisations et informations relatives à l\'urbanisme et aux travaux.', '["Permis de construire","Permis de démolir","Déclaration préalable de travaux","Certificat d\'urbanisme","Plan local d\'urbanisme (PLU)","Alignement voirie"]', 'bg-amber-100', 'text-amber-700', 'border-amber-200'),
(3, 'Éducation', 'Inscriptions scolaires et services périscolaires pour votre enfant.', '["Inscription en école maternelle","Inscription en école élémentaire","Restaurant scolaire (cantine)","Garderie périscolaire","Activités extra-scolaires","Transport scolaire"]', 'bg-green-100', 'text-green-700', 'border-green-200'),
(4, 'Culture', 'Médiathèque, patrimoine et vie culturelle au service des habitants.', '["Médiathèque municipale","Expositions et galeries","Concerts et spectacles","Patrimoine local","Soutien aux associations culturelles","École de musique municipale"]', 'bg-purple-100', 'text-purple-700', 'border-purple-200'),
(5, 'Sport', 'Installations sportives et associations pour une pratique pour tous.', '["Stade municipal","Salle polyvalente","Piscine municipale","Gymnase","Terrains de tennis","Soutien aux clubs sportifs"]', 'bg-red-100', 'text-red-700', 'border-red-200'),
(6, 'Environnement', 'Actions municipales pour un cadre de vie durable et agréable.', '["Collecte des déchets","Déchetterie municipale","Espaces verts et parcs","Développement durable","Qualité de l\'eau","Plantations et fleurissement"]', 'bg-teal-100', 'text-teal-700', 'border-teal-200');
```

### Étape 4: Variables d'environnement backend

Ajoute à backend/.env:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mairie_mbaling
```

Avec XAMPP, le mot de passe MySQL est vide par défaut.

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

- La base de données MySQL est persistante (données sauvegardées sur disque)
- En production, utilise un service MySQL managé (AWS RDS, Google Cloud SQL, etc)
- Fichier .env ne doit pas être commit (ajoute .env à .gitignore)

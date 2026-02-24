# Apex Tracks
Apex Tracks ist eine Webanwendung für Motorsport-Enthusiasten. Die Plattform kombiniert ein interaktives Strecken-Logbuch mit einem integrierten E-Commerce-Shop für Merchandise und Fahrzeugzubehör. Dieses Projekt wurde als MVP entwickelt.

## Kern-Features

- **Strecken (Tracks):** Durchsuchen von Rennstrecken, Ansehen von Details und Community-Bewertungen.
- **Shop-System:** Voll funktionsfähiger Produktkatalog, Warenkorb-System und Checkout-Flow (Status: Created → Paid → Shipped).
- **User-Accounts:** Registrierung, Login und Profilverwaltung.
- **Admin-Dashboard:** Produkte hinzufügen, bearbeiten oder löschen.

## ⚠️ MVP-Hinweise / Architektur-Entscheidungen
(NEU: Sehr wichtig! Hier erklärst du, dass ihr z.B. absichtlich JSON-Dateien statt einer echten Datenbank nutzt und der Checkout nur simuliert ist. Das zeigt, dass du mitgedacht hast!)

## Tech Stack

Das Projekt folgt einer modernen Client-Server-Architektur, vollständig typisiert mit TypeScript.

- **Frontend:**
    - **Framework:** [React Router v7]
    - **Build Tool:** Vite

- **Backend:**
    - **Framework:** [NestJS v11](https://nestjs.com/)
    - **Datenhaltung:** JSON
    - **Module:** Auth, Users, Products, Orders, Tracks

## Voraussetzungen
- **npm-Version**: 11.4.2
- **Node.js-Version**: v22.11.0

## Installation & Start
- Backend starten:
    ```
    cd server
    npm i
    npm run start
    ```

- Frontend starten:
    ```
    cd frontend
    npm i
    npm run dev
    ```

## Authentifizierung & Demo-Zugänge
- Admin-Zugang (Vollzugriff)
    - **E-Mail:** `admin@apex.de`
    - **Passwort:** `Admin123!`
    - **Rolle:** `admin`

- User-Zugang (Eingeschränkter Zugriff)
    - **E-Mail:** `test@test.com`
    - **Passwort:** `User123!`
    - **Rolle:** `user`

## 🔌 API Endpoints
(Eine kurze Übersicht der wichtigsten Routen, z.B. `GET /products`, `POST /auth/login`...)

## Projektstruktur

Das Repository ist in zwei Hauptverzeichnisse unterteilt:

```t
formel-1/
├── frontend/               # React Router Frontend
│   ├── app/
│   │   ├── components/     # Wiederverwendbare UI-Komponenten (Header, Stars, Stats)
│   │   ├── routes/         # Seiten (Startseite, Shop, Bahnen, Admin, Cart, Auth)
│   │   ├── utils/          # Hilfsfunktionen & Loader-Logik
│   │   └── types.ts        # Globale TypeScript-Interfaces
│   └── package.json
│
└── server/                 # NestJS Backend
    ├── src/
    │   ├── auth/           # Login & Session-Management
    │   ├── products/       # Shop-Produkte Controller/Service
    │   ├── orders/         # Bestellabwicklung
    │   ├── tracks/         # Strecken-Logik
    │   └── users/          # Benutzerverwaltung
    ├── data/               # Weitere lokale JSON-Daten
    ├── products.json       # JSON-Datenbank für Produkte
    ├── tracks.json         # JSON-Datenbank für Rennstrecken
    └── package.json
```
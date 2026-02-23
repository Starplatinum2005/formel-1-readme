# Apex Tracks

Apex Tracks ist eine Webanwendung für Motorsport-Enthusiasten. Die Plattform kombiniert ein interaktives Strecken-Logbuch mit einem integrierten E-Commerce-Shop für Merchandise und Fahrzeugzubehör. Dieses Projekt wurde als MVP (Minimum Viable Product) entwickelt.

## Kern-Features

* **Strecken-Datenbank (Tracks):** Durchsuchen von Rennstrecken, Ansehen von Details und Community-Bewertungen.
* **Shop-System:** Voll funktionsfähiger Produktkatalog, Warenkorb-System und Checkout-Flow (Status: Created → Paid → Shipped).
* **User-Accounts:** Registrierung, Login und Profilverwaltung.
* **Admin-Dashboard:** Produkte hinzufügen, bearbeiten oder löschen.

## Tech Stack

Das Projekt folgt einer modernen Client-Server-Architektur, vollständig typisiert mit TypeScript.

**Frontend:**
* **Framework:** [React Router v7](https://reactrouter.com/) (Framework Mode) / React 19
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS
* **Build Tool:** Vite

**Backend:**
* **Framework:** [NestJS v11](https://nestjs.com/)
* **Datenhaltung:** JSON-basiertes File-System (für das MVP)
* **Module:** Auth, Users, Products, Orders, Tracks

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
└── backend/                # NestJS Backend
    ├── src/
    │   ├── auth/           # Login & Session-Management
    │   ├── products/       # Shop-Produkte Controller/Service
    │   ├── orders/         # Bestellabwicklung
    │   ├── tracks/         # Strecken-Logik
    │   └── users/          # Benutzerverwaltung
    ├── data/               # Lokale JSON-Datenbankdateien
    └── package.json
```
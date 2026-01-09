import React from "react";
import "./header.css";



export default function Header(){
    return(
        <header className="header">
        <div className="container header__inner">
          <div className="brand">
            <div className="brand__mark" aria-hidden="true" />
            <div className="brand__text">
              <div className="brand__name">Apex Tracks</div>
              <div className="brand__tag">Track Profiles • Reviews • Gear</div>
            </div>
          </div>

          <nav className="nav" aria-label="Hauptnavigation">
            <a className="nav__link" href="/tracks">
              Tracks
            </a>
            <a className="nav__link" href="/news">
              News
            </a>
            <a className="nav__link" href="/shop">
              Shop
            </a>
            <a className="nav__link nav__link--ghost" href="/auth/login">
              Login
            </a>
            <a className="nav__link nav__link--cta" href="/auth/register">
              Profil erstellen
            </a>
          </nav>
        </div>
      </header>
    )
}
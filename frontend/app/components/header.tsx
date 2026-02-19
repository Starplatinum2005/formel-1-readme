import { Link } from "react-router";
import { useEffect, useState } from "react";
import "./header.css";

type MeResponse = { email: string; role: string };


export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function handleLogout() {
    localStorage.removeItem("sessionToken");
    setIsLoggedIn(false);
    setIsAdmin(false);

    // optional: zurück zur Startseite
    window.location.href = "/";
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("sessionToken");
    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      return;
    }

    fetch("http://localhost:3000/auth/me", {
      headers: { "x-session-token": token },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: MeResponse | null) => {
        if (!data) {
          setIsLoggedIn(false);
          setIsAdmin(false);
          return;
        }
        setIsLoggedIn(true);
        setIsAdmin(data.role === "admin");
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsAdmin(false);
      });
  }, []);

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="brand">
          <Link to="/" className="brand">
            <img src="/logo1.png" alt="Logo" className="brand_logo" />
          </Link>
          <div className="brand__text">
            <div className="brand__name">Apex Tracks</div>
            <div className="brand__tag">Track Profiles • Reviews • Gear</div>
          </div>
        </div>

        <nav className="nav" aria-label="Hauptnavigation">
          <Link className="nav__link" to="/tracks">
            Tracks
          </Link>

          {/* Achtung: /news ist bei dir NICHT als Route definiert -> führt aktuell immer zu 404 */}
          {/* Wenn du es noch nicht hast, lieber entfernen oder später implementieren */}
          {/* <Link className="nav__link" to="/news">News</Link> */}

          <Link className="nav__link" to="/shop">
            Shop
          </Link>

          {/* Profil erstellen nur anzeigen, wenn NICHT eingeloggt */}
          {!isLoggedIn && (
            <Link className="nav__link nav__link--cta" to="/register">
              Profil erstellen
            </Link>
          )}

          {isAdmin && (
            <Link className="nav__link" to="/admin">
              Admin
            </Link>
          )}

          {!isLoggedIn && (
            <Link className="nav__link" to="/login">
              Login
            </Link>
          )}

          {isLoggedIn && (
            <button className="nav__link nav__logout" onClick={handleLogout}>
              Logout
            </button>
          )}

        </nav>
      </div>
    </header>
  );
}

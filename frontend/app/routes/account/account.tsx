import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import "./account.css";

type MeResponse = {
  email: string;
  role: "admin" | "user";
  firstName: string;
  lastName: string;
  username: string;
};

export default function AccountPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/auth/me", {
      headers: { "x-session-token": token },
    })
      .then(async (res) => {
        if (!res.ok) {
          // Session ungültig -> Token löschen und zum Login
          localStorage.removeItem("sessionToken");
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setMe(data);
      })
      .catch(() => setError("Server nicht erreichbar."))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="acc-page">
      <div className="acc-card">
        <div className="acc-header">
          <div>
            <h1 className="acc-title">Mein Account</h1>
            <p className="acc-subtitle">Deine gespeicherten Kontodaten</p>
          </div>
          <Link className="acc-back" to="/">
            ← Startseite
          </Link>
        </div>

        {loading && <p className="acc-muted">Lade Account…</p>}
        {error && <div className="acc-alert acc-alert--error">⚠️ {error}</div>}

        {me && (
          <div className="acc-grid">
            <div className="acc-item">
              <div className="acc-label">Vorname</div>
              <div className="acc-value">{me.firstName}</div>
            </div>

            <div className="acc-item">
              <div className="acc-label">Nachname</div>
              <div className="acc-value">{me.lastName}</div>
            </div>

            <div className="acc-item">
              <div className="acc-label">Benutzername</div>
              <div className="acc-value">{me.username}</div>
            </div>

            <div className="acc-item">
              <div className="acc-label">E-Mail</div>
              <div className="acc-value">{me.email}</div>
            </div>

            <div className="acc-item">
              <div className="acc-label">Rolle</div>
              <div className="acc-value">
                {me.role === "admin" ? "Admin" : "User"}
              </div>
            </div>
          </div>
        )}

        <div className="acc-footer">
          <Link className="acc-link" to="/shop">→ Zum Shop</Link>
          <Link className="acc-link" to="/tracks">→ Zu den Tracks</Link>
        </div>
      </div>
    </div>
  );
}

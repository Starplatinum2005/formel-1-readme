import { useState } from "react";
import { useNavigate, Link } from "react-router";
import "./register.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.message || `Fehler (${res.status})`);
        setLoading(false);
        return;
      }

      // Erfolg
      setMsg("Account erfolgreich erstellt. Du wirst zur Startseite weitergeleitet...");

      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");

      // Weiterleitung nach 1.5 Sekunden
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch {
      setErr("Server nicht erreichbar.");
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Account erstellen</h1>
        <p className="register-subtitle">
          Lege dein persönliches Benutzerkonto an.
        </p>

        {err && <div className="register-alert error">⚠️ {err}</div>}
        {msg && <div className="register-alert success">✅ {msg}</div>}

        <form onSubmit={handleSubmit} className="register-form">

          <div className="form-group">
            <label>Vorname</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nachname</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Benutzername</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Account wird erstellt..." : "Registrieren"}
          </button>
        </form>

        <p className="register-footer">
          Bereits registriert? <Link to="/login">Zum Login</Link>
        </p>
      </div>
    </div>
  );
}

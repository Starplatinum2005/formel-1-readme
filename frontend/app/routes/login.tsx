import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Login fehlgeschlagen");
      return;
    }

    const data = await res.json();

    // 🔹 PUNKT 1: Session-Token speichern
    localStorage.setItem("sessionToken", data.token);

    // optional (nur für UI)
    localStorage.setItem("role", data.role);

    navigate("/shop");
  }

  return (
    <div>
      <h1>Login</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Verhindert Fehler beim Server-Side-Rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Diese Daten braucht deine Shop-Seite
        localStorage.setItem('sessionToken', data.token);


        // Erfolg melden und zum Shop springen
        window.location.href = "/shop";
      } else {
        setError(data.message || "Login fehlgeschlagen. Daten prüfen!");
      }
    } catch (err) {
      setError("Backend nicht erreichbar. Läuft dein NestJS auf Port 3000?");
    }
  };

  if (!isClient) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        padding: '40px',
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', color: '#e10600' }}>Apex Login</h1>

        {error && (
          <div style={{ backgroundColor: 'rgba(255,0,0,0.1)', color: 'red', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>E-Mail Adresse</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white' }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#e10600',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}
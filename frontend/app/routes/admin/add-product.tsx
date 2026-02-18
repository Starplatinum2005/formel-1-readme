import { useState } from "react";
import "./add-product.css"; // Wir nutzen die vorhandenen Styles

const CATEGORIES = ["Fahrzeuge", "Ausrüstung", "Merchandise", "Hardware"];

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const token = localStorage.getItem('sessionToken');

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": token || "" // Das Backend prüft dies im RolesGuard
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          image
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Produkt erfolgreich hinzugefügt!' });
        // Felder leeren
        setName("");
        setDescription("");
        setPrice("");
        setImage("");
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Fehler beim Speichern' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server nicht erreichbar' });
    }
  };

  return (
    <div className="shop-container">
      <h1>Neues Produkt hinzufügen</h1>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {message && (
          <p style={{ color: message.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>
            {message.text}
          </p>
        )}

        <label>Produktname:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%' }} />
        </label>

        <label>Beschreibung:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%' }} />
        </label>

        <label>Preis:
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%' }} />
        </label>

        <label>Kategorie:
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%' }}>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label>

        <label>Bild-URL (optional):
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." style={{ width: '100%' }} />
        </label>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ backgroundColor: '#e10600', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
            Produkt Speichern
          </button>
          <button type="button" onClick={() => window.location.href = '/shop'} style={{ background: 'none', border: '1px solid gray', padding: '10px 20px', cursor: 'pointer' }}>
            Zurück zum Shop
          </button>
        </div>
      </form>
    </div>
  );
}
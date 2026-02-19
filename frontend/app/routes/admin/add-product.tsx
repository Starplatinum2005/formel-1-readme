import { useState } from "react";
import "./add-product.css";

const CATEGORIES = ["Fahrzeuge", "Ausrüstung", "Merchandise", "Hardware"];

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const token = localStorage.getItem("sessionToken");

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-token": token || "",
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          image,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Produkt erfolgreich hinzugefügt!" });
        setName("");
        setDescription("");
        setPrice("");
        setImage("");
      } else {
        // Nicht jeder Fehler liefert JSON – daher defensiv:
        let text = "Fehler beim Speichern";
        try {
          const data = await response.json();
          text = data?.message || text;
        } catch {}
        setMessage({ type: "error", text });
      }
    } catch {
      setMessage({ type: "error", text: "Server nicht erreichbar" });
    }
  };

  return (
    <div className="admin-container">
      <h1>Neues Produkt hinzufügen</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {message && (
          <p className={`admin-message ${message.type === "error" ? "error" : ""}`}>
            {message.text}
          </p>
        )}

        <label>
          Produktname:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Beschreibung:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Preis:
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <div className="category-select-wrapper">
          <label>Kategorie</label>
          <select
            className="admin-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <label>
          Bild-URL (optional):
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <button type="submit">Produkt speichern</button>

        {/* optional: Zurück-Button (deine CSS stylt Buttons in .admin-form automatisch mit) */}
        <button type="button" onClick={() => (window.location.href = "/shop")}>
          Zurück zum Shop
        </button>
      </form>
    </div>
  );
}

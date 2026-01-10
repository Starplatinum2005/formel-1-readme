import { useState } from "react";
import "./add-product.css";

// Definiere die verfügbaren Kategorien
const CATEGORIES = ["Fahrzeuge", "Ausrüstung", "Merchandise", "Hardware"];

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]); // Standardwert
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      image: imageUrl,
    };

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-role": "admin",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setMessage(`Erfolg: Produkt in '${category}' gespeichert!`);
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setCategory(CATEGORIES[0]);
      } else {
        setMessage("Fehler: Nur Admins dürfen das.");
      }
    } catch {
      setMessage("Server nicht erreichbar.");
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin · Produkt hinzufügen</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          placeholder="Produktname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Preis (€)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          placeholder="Bild-URL (z.B. https://...)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {/* Neues Dropdown-Menü für Kategorien */}
        <div className="category-select-wrapper">
          <label htmlFor="category">Kategorie:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="admin-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Produkt speichern</button>
      </form>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
}
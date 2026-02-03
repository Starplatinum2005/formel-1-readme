import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

useEffect(() => {
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    navigate("/login");
  }
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      category,
      image: imageUrl,
    };

    const token = localStorage.getItem("sessionToken");

    const response = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-token": token ?? "",
      },
      body: JSON.stringify(newProduct),
    });


    if (response.status === 401) {
      setMessage("Nicht erlaubt: Bitte als Admin anmelden.");
    } else {
      setMessage("Fehler beim Speichern.");
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
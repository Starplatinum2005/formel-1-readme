import { useState } from "react";
import "./add-product.css";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
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
        setMessage("Produkt erfolgreich hinzugefügt!");
        setName("");
        setDescription("");
        setPrice("");
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

        <button type="submit">Produkt speichern</button>
      </form>

      {message && <p className="admin-message">{message}</p>}
    </div>
  );
}

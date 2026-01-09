import { useEffect, useState } from "react";
import "./shop.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // 1. Interface erweitert
}

// Kategorien identisch zum Admin-Bereich
const CATEGORIES = ["Alle", "Fahrzeuge", "Ausrüstung", "Merchandise", "Hardware"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Alle"); // 2. Filter-State
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => {
        if (!response.ok) throw new Error("Fehler beim Laden der Daten");
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message));
  }, []);

  // 3. Filter-Logik
  const filteredProducts = selectedCategory === "Alle" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="shop-container">
      <h1>Apex League Shop</h1>
      
      {/* 4. Filter-Buttons */}
      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`filter-button ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="product-grid">
        {filteredProducts.length === 0 && !error && <p>Keine Produkte in dieser Kategorie gefunden.</p>}
        
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            {/* Kategorie-Label anzeigen */}
            <span className="category-badge">{product.category}</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="price-tag">{product.price.toFixed(2)} €</div>
            <button className="buy-button">In den Warenkorb</button>
          </div>
        ))}
      </div>
    </div>
  );
}
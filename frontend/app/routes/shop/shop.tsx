import { useEffect, useState } from "react";
import { formatEuroDE } from "~/utils/format";
import "./shop.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const CATEGORIES = ["Fahrzeuge", "Ausrüstung", "Merchandise", "Hardware"];



export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'admin');
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => {
        if (!response.ok) throw new Error("Fehler beim Laden der Daten");
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="shop-container">
      <h1>Apex League Shop</h1>

      {error && <p className="error-msg">{error}</p>}

      {/* Wir gehen jede Kategorie einzeln durch */}
      {CATEGORIES.map((cat) => {
        const categoryProducts = products.filter(p => p.category === cat);

        if (categoryProducts.length === 0) return null;

        return (
          <div key={cat} className="category-section">
            <h2 className="category-title">{cat}</h2>
            <div className="product-grid">
              {categoryProducts.map((product) => (
                <div key={product.id} className="product-card">

                  {/* --- BILD-BEREICH ANFANG --- */}
                  {product.image && (
                    <div className="product-image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                  {/* --- BILD-BEREICH ENDE --- */}

                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="price-tag">{formatEuroDE(product.price)}</div>
                  <button className="buy-button">In den Warenkorb</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {products.length === 0 && !error && (
        <p className="no-products">Aktuell sind keine Produkte verfügbar.</p>
      )}
    </div>
  );
}

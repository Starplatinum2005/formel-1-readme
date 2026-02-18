import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import "./delete-product.css";

type Product = {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
};

export default function DeleteProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((r) => {
        if (!r.ok) throw new Error("Produkte konnten nicht geladen werden");
        return r.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Filtert "leere" Produkte raus (damit keine leeren Karten entstehen)
  const validProducts = useMemo(() => {
    return products.filter((p) => {
      const id = (p?.id ?? "").trim();
      const name = (p?.name ?? "").trim();
      const category = (p?.category ?? "").trim();
      return id.length > 0 && name.length > 0 && category.length > 0;
    });
  }, [products]);

  async function handleDelete(id: string, name: string) {
    setError(null);
    setInfo(null);

    const token = localStorage.getItem("sessionToken");
    if (!token) {
      setError("Nicht eingeloggt (Token fehlt).");
      return;
    }

    const ok = window.confirm(`Produkt wirklich löschen?\n\n${name}`);
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
        headers: { "x-session-token": token },
      });

      if (res.status === 401) return setError("Nicht eingeloggt oder Session ungültig (401).");
      if (res.status === 403) return setError("Keine Admin-Rechte (403).");
      if (res.status === 404) return setError("Produkt nicht gefunden (404).");
      if (!res.ok) return setError(`Fehler beim Löschen (${res.status}).`);

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setInfo(`Produkt gelöscht: ${name}`);
    } catch {
      setError("Server nicht erreichbar.");
    }
  }

  return (
    <div className="dp-page">
      <div className="dp-container">
        <header className="dp-header">
          <div>
            <h1 className="dp-title">Produkte löschen</h1>
            <p className="dp-subtitle">Klicke auf ein Produkt, um es dauerhaft zu entfernen.</p>
          </div>

          <Link to="/admin" className="dp-back">
            ← Admin-Menü
          </Link>
        </header>

        {loading && <p className="dp-muted">Lade Produkte…</p>}
        {error && <div className="dp-alert dp-alert--error">⚠️ {error}</div>}
        {info && <div className="dp-alert dp-alert--success">✅ {info}</div>}

        {!loading && validProducts.length === 0 && (
          <div className="dp-empty">
            <div className="dp-emptyIcon">📦</div>
            <div>
              <h2>Keine löschbaren Produkte vorhanden</h2>
              <p>Entweder gibt es keine Produkte oder es existieren nur unvollständige Einträge.</p>
            </div>
          </div>
        )}

        <div className="dp-grid">
          {validProducts.map((p) => (
            <article key={p.id} className="dp-card">
              {/* ✅ Fallback ist immer da, Bild liegt darüber. Wenn Bild kaputt -> Fallback bleibt sichtbar */}
              <div className="dp-thumb">
                <div className="dp-thumbFallback">🖼️</div>
                {p.image && (
                  <img
                    className="dp-thumbImg"
                    src={p.image}
                    alt={p.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              <div className="dp-cardBody">
                <div className="dp-cardTop">
                  <h3 className="dp-cardTitle">{p.name}</h3>
                  <span className="dp-badge">{p.category}</span>
                </div>

                <p className="dp-cardDesc">{(p.description ?? "").trim() || "—"}</p>

                <div className="dp-cardActions">
                  <button
                    className="dp-deleteBtn"
                    onClick={() => handleDelete(p.id!, p.name!)}
                  >
                    🗑️ Löschen
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="dp-footer">
          <Link to="/shop" className="dp-secondaryLink">
            ← Zurück zum Shop
          </Link>
        </footer>
      </div>
    </div>
  );
}

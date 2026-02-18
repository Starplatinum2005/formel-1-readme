import { Link } from "react-router";
import "./admin.css";

export default function AdminPage() {
  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <h1 className="admin-title">Admin Bereich</h1>
        <p className="admin-subtitle">
          Verwalte Inhalte deines Shops und der Plattform.
        </p>

        <div className="admin-grid">

          <Link className="admin-card primary" to="/admin/add-product">
            <div className="admin-card-icon">➕</div>
            <div className="admin-card-content">
              <h2>Produkt hinzufügen</h2>
              <p>Neues Produkt im Shop anlegen</p>
            </div>
          </Link>

          <Link className="admin-card" to="/admin/delete-product">
            <div className="admin-card-icon">🗑️</div>
            <div className="admin-card-content">
              <h2>Produkt löschen</h2>
              <p>Produkt im Shop löschen</p>
            </div>
          </Link>

          <button className="admin-card" disabled>
            <div className="admin-card-icon">🏁</div>
            <div className="admin-card-content">
              <h2>Strecke hinzufügen</h2>
              <p>Kommt später</p>
            </div>
          </button>

          <button className="admin-card" disabled>
            <div className="admin-card-icon">❌</div>
            <div className="admin-card-content">
              <h2>Strecke löschen</h2>
              <p>Kommt später</p>
            </div>
          </button>

        </div>

        <Link to="/shop" className="admin-back">
          ← Zurück zum Shop
        </Link>
      </div>
    </div>
  );
}

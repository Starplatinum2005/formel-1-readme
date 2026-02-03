import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./track.css";

type Rating = { id: string; value: number; createdAt?: string };
type TimeEntry = { id: string; time: number; by?: string; createdAt?: string };
type Track = {
    id: string;
    name: string;
    description: string;
    image?: string;
    avgRating?: number;
    lengthKm?: number;
    laps?: number;
    firstGrandPrix?: number;
    country?: string;
    recordLap?: {
        time: number;
        driver: string;
        year: number;
    };
    ratings?: Rating[];
    times?: TimeEntry[];
};


const API_BASE = "http://localhost:3000";

export default function TrackPage() {
    const params = useParams();
    const id = params.id as string | undefined;
    const [track, setTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [rateVal, setRateVal] = useState(5);
    const [timeVal, setTimeVal] = useState<number | string>(0);
    const [by, setBy] = useState("");

    useEffect(() => {
        let alive = true;
        if (!id) {
            setError("Keine Strecken-ID angegeben");
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(`${API_BASE}/tracks/${encodeURIComponent(id)}`)
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText || "Fehler beim Laden");
                return r.json();
            })
            .then((data) => {
                if (!alive) return;
                setTrack(data);
            })
            .catch((e) => setError(String(e)))
            .finally(() => setLoading(false));

        return () => {
            alive = false;
        };
    }, [id]);

    async function submitRating() {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE}/tracks/${encodeURIComponent(id)}/rating`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: rateVal }),
            });
            const updated = await res.json();
            setTrack(updated);
        } catch (e) {
            console.error(e);
            setError(String(e));
        }
    }

    async function submitTime() {
        if (!timeVal || Number(timeVal) <= 0 || by.trim() === "") {
        alert("Bitte gib eine gültige Zeit und deinen Namen ein.");
        return;
        }
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE}/tracks/${encodeURIComponent(id)}/time`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ time: Number(timeVal), by }),
            });
            const updated = await res.json();
            setTrack(updated);
            setTimeVal(0);
            setBy("");
        } catch (e) {
            console.error(e);
            setError(String(e));
        }
    }

    if (loading) return <div className="page container">Lädt…</div>;
    if (error) return <div className="page container">Fehler: {error}</div>;
    if (!track) return <div className="page container">Strecke nicht gefunden.</div>;

    return (
        <div className="track-page">
            <div className="container">

                <h1>{track.name}</h1>

                <img
                    className="trackcard__image"
                    src={track.image ?? `https://picsum.photos/seed/${track.id}/900/360`}
                    alt={track.name}
                />

                <div className="content-card">
                    <p>{track.description}</p>
                    <div className="muted">
                        Durchschnitt: {(track.avgRating ?? 0).toFixed(2)} ★
                    </div>

                    <div className="track-meta">
                        <div>
                            <span>Länge</span>
                            <strong>{track.lengthKm ?? "–"} km</strong>
                        </div>
                        <div>
                            <span>Runden</span>
                            <strong>{track.laps ?? "–"}</strong>
                        </div>
                        <div>
                            <span>Erster GP</span>
                            <strong>{track.firstGrandPrix ?? "–"}</strong>
                        </div>
                        <div>
                            <span>Land</span>
                            <strong>{track.country ?? "–"}</strong>
                        </div>

                        {track.recordLap && (
                            <div className="record">
                                <span>Rundenrekord</span>
                                <strong>
                                    {track.recordLap.time}s – {track.recordLap.driver} ({track.recordLap.year})
                                </strong>
                            </div>
                        )}
                    </div>

                    <section>
                        <h3>Bewertung</h3>
                        <div className="form-row">
                            <select value={rateVal} onChange={e => setRateVal(Number(e.target.value))}>
                                {[5, 4, 3, 2, 1].map(n => (
                                    <option key={n} value={n}>{n} ★</option>
                                ))}
                            </select>
                            <button className="btn" onClick={submitRating}>Absenden</button>
                        </div>
                    </section>

                    <section>
                        <h3>Rundenzeit eintragen</h3>
                        <div className="form-row">
                            <input
                                type="number"
                                placeholder="Zeit (s)"
                                value={timeVal}
                                onChange={e => setTimeVal(e.target.value)}
                                min="0"
                            />
                            <input
                                placeholder="Name"
                                value={by}
                                onChange={e => setBy(e.target.value)}
                            />
                            <button className="btn" onClick={submitTime}>Eintragen</button>
                        </div>
                    </section>

                    <section>
                        <h3>Letzte Zeiten</h3>
                        {track.times?.length ? (
                            <ul className="small">
                                {track.times.slice().reverse().map(t => (
                                    <li key={t.id}>
                                        <span>{t.time}s</span>
                                        <span>{t.by}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="muted">Keine Zeiten vorhanden</div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import "./bahnen.css";

type Rating = { id: string; value: number; createdAt?: string };
type TimeEntry = { id: string; time: number; by?: string; createdAt?: string };
type Track = {
	id: string;
	name: string;
	description: string;
	image?: string;
	avgRating?: number;
	ratings?: Rating[];
	times?: TimeEntry[];
};

const API_BASE = "http://localhost:3000";

export default function BahnenPage() {
	const [tracks, setTracks] = useState<Track[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let alive = true;
		setLoading(true);
		fetch(`${API_BASE}/tracks`)
			.then((r) => r.json())
			.then((data) => {
				if (!alive) return;
				setTracks(data);
			})
			.catch((e) => setError(String(e)))
			.finally(() => setLoading(false));
		return () => {
			alive = false;
		};
	}, []);

	if (loading) return <div className="page container">Strecken werden geladen…</div>;
	if (error) return <div className="page container">Fehler: {error}</div>;

	return (
		<div className="page container">
			<h1>Rennstrecken</h1>
			<p className="lead">Bewerte Strecken, siehe Dir die Beschreibung an und trage Deine Bestzeit ein!</p>

			<div className="tracks">
				{tracks && tracks.length ? (
					tracks.map((t) => <TrackCard key={t.id} track={t} />)
				) : (
					<div>Keine Strecken gefunden.</div>
				)}
			</div>
		</div>
	);
}

function TrackCard({ track }: { track: Track }) {
    return (
        <article className="trackcard">
            {/* OBEN: Bild */}
            <div className="trackcard__header">
                <a href={`/tracks/${track.id}`}>
                    <img 
                        className="trackcard__image" 
                        src={track.image ?? `https://picsum.photos/seed/${encodeURIComponent(track.id)}/600/300`} 
                        alt={track.name} 
                    />
                </a>
            </div>

            {/* MITTE: Titel & Beschreibung */}
            <div className="trackcard__body">
                <h2 className="trackcard__name">
                    <a href={`/tracks/${track.id}`}>{track.name}</a>
                </h2>
                <p className="trackcard__desc">{track.description}</p>
            </div>

            {/* UNTEN: Statistiken & Button */}
            <div className="trackcard__footer">
                <div className="trackcard__stats">
                    <div className="stat-item">
                        <span>⭐</span> 
                        <strong>{(track.avgRating ?? 0).toFixed(1)}</strong> 
                        <span style={{color: '#999'}}>/ 5.0</span>
                    </div>
                    <div className="stat-item">
                        <span>⏱️</span> 
                        {track.times?.length ?? 0} Zeiten
                    </div>
                </div>
                
                <a className="btn" href={`/tracks/${track.id}`}>
                    Details ansehen
                </a>
            </div>
        </article>
    );
}
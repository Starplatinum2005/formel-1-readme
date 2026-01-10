import { useEffect, useState } from "react";
import "./bahnen.css";

type Rating = { id: string; value: number; createdAt?: string };
type TimeEntry = { id: string; time: number; by?: string; createdAt?: string };
type Track = {
	id: string;
	name: string;
	description: string;
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

	async function submitRating(trackId: string, value: number) {
		try {
			const res = await fetch(`${API_BASE}/tracks/${encodeURIComponent(trackId)}/rating`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ rating: value }),
			});
			const updated = await res.json();
			setTracks((prev) => (prev ? prev.map((t) => (t.id === updated.id ? updated : t)) : [updated]));
		} catch (e) {
			console.error(e);
		}
	}

	async function submitTime(trackId: string, time: number, by?: string) {
		try {
			const res = await fetch(`${API_BASE}/tracks/${encodeURIComponent(trackId)}/time`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ time, by }),
			});
			const updated = await res.json();
			setTracks((prev) => (prev ? prev.map((t) => (t.id === updated.id ? updated : t)) : [updated]));
		} catch (e) {
			console.error(e);
		}
	}

	if (loading) return <div className="page container">Strecken werden geladen…</div>;
	if (error) return <div className="page container">Fehler: {error}</div>;

	return (
		<div className="page container">
			<h1>Rennstrecken</h1>
			<p className="lead">Bewerte Strecken, siehe Dir die Beschreibung an und trage Deine Bestzeit ein!</p>

			<div className="tracks">
				{tracks && tracks.length ? (
					tracks.map((t) => <TrackCard key={t.id} track={t} onRate={submitRating} onTime={submitTime} />)
				) : (
					<div>Keine Strecken gefunden.</div>
				)}
			</div>
		</div>
	);
}

function TrackCard({ track, onRate, onTime }: { track: Track; onRate: (id: string, v: number) => void; onTime: (id: string, time: number, by?: string) => void }) {
	const [rateVal, setRateVal] = useState(5);
	const [timeVal, setTimeVal] = useState(0);
	const [by, setBy] = useState('');

	return (
		<article className="trackcard">
			<div className="trackcard__left">
				<div className="trackcard__name">{track.name}</div>
				<p className="trackcard__desc">{track.description}</p>
				<div className="muted">Durchschnitt: {(track.avgRating ?? 0).toFixed(2)} ★</div>
				<div className="muted">Zeiten: {track.times?.length ?? 0}</div>
			</div>

			<div className="trackcard__right">
				<div className="form-row">
					<label>Bewertung</label>
					<select value={rateVal} onChange={(e) => setRateVal(Number(e.target.value))}>
						{[5,4,3,2,1].map((n)=> <option key={n} value={n}>{n} ★</option>)}
					</select>
					<button className="btn" onClick={() => onRate(track.id, rateVal)}>Absenden</button>
				</div>

				<div className="form-row">
					<label>Rundenzeit (s)</label>
					<input type="number" value={timeVal} onChange={(e)=> setTimeVal(Number(e.target.value))} />
					<input placeholder="Name" value={by} onChange={(e)=> setBy(e.target.value)} />
					<button className="btn" onClick={()=> onTime(track.id, Number(timeVal), by)}>Eintragen</button>
				</div>

				{track.times && track.times.length ? (
					<details>
						<summary>Letzte Zeiten ({track.times.length})</summary>
						<ul className="small">
							{track.times.slice(-5).reverse().map((tt)=> (
								<li key={tt.id}>{tt.time}s — {tt.by}</li>
							))}
						</ul>
					</details>
				) : null}
			</div>
		</article>
	);
}


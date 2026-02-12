//startseite
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  category: "Platform" | "Tracks" | "Community" | "Shop";
  publishedAt: string; // ISO
  readingTimeMin: number;
};

export type TrackCard = {
  id: string;
  name: string;
  country: string;
  difficulty: "Easy" | "Medium" | "Hard";
  avgRating: number; // 0..5
  totalReviews: number;
};

export type ProductCard = {
  id: string;
  name: string;
  priceEUR: number;
  badge?: "New" | "Bestseller" | "Limited";
};

//ende






export type Rating = { id: string; value: number; createdAt?: string };

export type TimeEntry = { id: string; time: number; by?: string; createdAt?: string };

export type Track = {
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
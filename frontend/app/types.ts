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
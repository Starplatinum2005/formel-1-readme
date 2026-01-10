import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class TracksService {
  private readonly dbPath = './tracks.json';

  private readData() {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([]));
    }
    const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
    return JSON.parse(fileContent);
  }

  private writeData(data: any) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  findAll() {
    return this.readData();
  }

  addRating(id: string, rating: number) {
    const tracks = this.readData();
    const t = tracks.find((x: any) => x.id === id);
    if (!t) throw new NotFoundException(`Track ${id} nicht gefunden`);
    if (!Array.isArray(t.ratings)) t.ratings = [];
    t.ratings.push({ id: uuidv4(), value: Number(rating), createdAt: new Date().toISOString() });

    // update avg
    const sum = t.ratings.reduce((s: number, r: any) => s + Number(r.value), 0);
    t.avgRating = sum / t.ratings.length;

    this.writeData(tracks);
    return t;
  }

  addTime(id: string, time: number, by?: string) {
    const tracks = this.readData();
    const t = tracks.find((x: any) => x.id === id);
    if (!t) throw new NotFoundException(`Track ${id} nicht gefunden`);
    if (!Array.isArray(t.times)) t.times = [];
    t.times.push({ id: uuidv4(), time: Number(time), by: by || 'anonymous', createdAt: new Date().toISOString() });
    this.writeData(tracks);
    return t;
  }
}

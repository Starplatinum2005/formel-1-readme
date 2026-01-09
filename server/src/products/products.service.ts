import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  // Pfad zu deiner JSON-Datei (muss im Hauptordner existieren)
  private readonly dbPath = './products.json'; 

private readData() {
  // Prüfen, ob die Datei überhaupt existiert
  if (!fs.existsSync(this.dbPath)) {
    // Wenn nicht: Erstelle sie mit einem leeren Array
    fs.writeFileSync(this.dbPath, JSON.stringify([]));
  }
  const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
  return JSON.parse(fileContent);
}

  // Hilfsmethode zum Schreiben in die Datei
  private writeData(data: any) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  // A1: CRUD - Create Operation
  create(createProductDto: CreateProductDto) {
    const products = this.readData();

    const newProduct = {
      id: uuidv4(), // Pflicht: Eindeutige ID [cite: 137]
      ...createProductDto,
      createdAt: new Date().toISOString(), // Pflicht: Meta-Property [cite: 138]
    };

    products.push(newProduct);
    this.writeData(products);

    return newProduct;
  }

  // A1: CRUD - Read Operation
  findAll() {
    return this.readData();
  }
}
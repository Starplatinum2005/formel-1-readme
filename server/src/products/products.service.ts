import { Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
  private readonly dbPath = "./products.json";

  private readData(): any[] {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([]));
    }
    const fileContent = fs.readFileSync(this.dbPath, "utf-8");
    try {
      return JSON.parse(fileContent);
    } catch {
      // falls Datei mal kaputt ist: nicht crashen
      return [];
    }
  }

  private writeData(data: any[]) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  create(createProductDto: CreateProductDto) {
    const products = this.readData();

    const newProduct = {
      id: uuidv4(),
      name: createProductDto.name,
      description: createProductDto.description,
      price: Number(createProductDto.price),
      category: createProductDto.category,
      image: createProductDto.image ?? "",
      stock: Number(createProductDto.stock ?? 0),
      createdAt: new Date().toISOString(),
    };


    products.push(newProduct);
    this.writeData(products);

    return newProduct;
  }

  delete(id: string) {
    const products = this.readData();
    const filteredProducts = products.filter((p) => p.id !== id);

    if (products.length === filteredProducts.length) {
      throw new NotFoundException(`Produkt mit ID ${id} nicht gefunden`);
    }

    this.writeData(filteredProducts);
    return { deleted: true, id };
  }

  findAll() {
    return this.readData();
  }
}

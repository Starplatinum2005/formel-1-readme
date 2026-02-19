import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateProductDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  // NEU
  @IsString()
  category: string;

  // optionales Bild
  @IsOptional()
  @IsString()
  image?: string;

  // GANZ WICHTIG für Warenkorb
  @IsNumber()
  @Min(0)
  stock: number;
}

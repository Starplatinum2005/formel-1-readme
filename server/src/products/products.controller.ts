import { Controller, Get, Post, Body, HttpCode, HttpStatus, Delete, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
// Oben bei den Imports hinzufügen:
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

@Controller('products')
@UseGuards(RolesGuard) // <--- Schützt alle Routen in diesem Controller
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Gibt 201 zurück 
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  return this.productsService.delete(id);
}

}
import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { RolesGuard } from "../auth/roles.guard";

@Controller("products")
@UseGuards(RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  remove(@Param("id") id: string) {
    // wirft NotFoundException, wenn nicht vorhanden -> 404
    return this.productsService.delete(id);
  }
}

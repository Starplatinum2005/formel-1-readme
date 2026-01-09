import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module'; // Pfad prüfen

@Module({
  imports: [ProductsModule], // <--- Das muss hier drin stehen!
  controllers: [],
  providers: [],
})
export class AppModule {}
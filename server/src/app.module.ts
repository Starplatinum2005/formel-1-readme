import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module'; // Pfad prüfen
import { TracksModule } from './tracks/tracks.module';
import { OrdersModule } from "./orders/orders.module";

@Module({
  imports: [ProductsModule, TracksModule, OrdersModule], // <--- Das muss hier drin stehen!
  controllers: [],
  providers: [],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module'; // Pfad prüfen
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [ProductsModule, TracksModule], // <--- Das muss hier drin stehen!
  controllers: [],
  providers: [],
})
export class AppModule {}
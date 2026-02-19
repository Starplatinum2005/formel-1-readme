import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("checkout")
  @HttpCode(HttpStatus.OK)
  checkout(@Body() body: { items: { productId: string; quantity: number }[] }) {
    return this.ordersService.checkout(body?.items ?? []);
  }
}

import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("shop")
@Controller("shop")
export class ShopController {
  constructor(private shop: ShopService) {}

  @Get("products")
  getProducts(@Query() q: any) { return this.shop.getProducts(q); }

  @Get("products/:id")
  getProduct(@Param("id") id: string) { return this.shop.getProduct(id); }

  @Post("orders")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.shop.createOrder(req.user.id, dto);
  }
}

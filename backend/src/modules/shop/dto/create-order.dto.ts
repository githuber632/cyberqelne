import { IsArray, IsString, IsOptional, IsNumber, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  paymentMethod: string;

  @IsString()
  @IsOptional()
  promoCode?: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

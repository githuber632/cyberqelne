import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PaymentMethod, ProductCategory } from "@prisma/client";

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async getProducts(filters: {
    category?: ProductCategory;
    search?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
  }) {
    const { category, search, page = 1, limit = 20, featured } = filters;

    const where: any = { isActive: true };
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }], isActive: true },
    });
    if (!product) throw new NotFoundException("Товар не найден");
    return product;
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    // Fetch all products and validate stock
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException("Один или несколько товаров недоступны");
    }

    // Calculate total
    let totalAmount = BigInt(0);
    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      totalAmount += product.price * BigInt(item.quantity);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Apply promo code discount
    let discount = 0;
    if (dto.promoCode) {
      discount = await this.validatePromoCode(dto.promoCode);
      totalAmount = totalAmount * BigInt(100 - discount) / BigInt(100);
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        paymentMethod: dto.paymentMethod as PaymentMethod,
        promoCode: dto.promoCode,
        discount,
        fullName: dto.fullName,
        address: dto.address,
        city: dto.city,
        phone: dto.phone,
        items: { createMany: { data: orderItems } },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Mock payment initiation
    const paymentUrl = await this.initiatePayment(order.id, totalAmount, dto.paymentMethod);

    return { order, paymentUrl };
  }

  async handlePaymentCallback(orderId: string, success: boolean) {
    if (success) {
      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paidAt: new Date() },
        include: { items: { include: { product: true } }, user: true },
      });

      // Process digital goods instantly
      const digitalItems = order.items.filter((i) => i.product.isDigital);
      if (digitalItems.length > 0) {
        await this.deliverDigitalGoods(order.userId, digitalItems);
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: "DELIVERED" },
        });
      }

      return order;
    } else {
      return this.prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    }
  }

  private async initiatePayment(
    orderId: string,
    amount: bigint,
    method: string
  ): Promise<string> {
    // Mock payment URLs — в production подключить реальные SDK
    const baseUrls: Record<string, string> = {
      PAYME: "https://checkout.paycom.uz",
      CLICK: "https://my.click.uz/services/pay",
      UZCARD: "https://uzcard.uz/pay",
      HUMO: "https://humo.uz/pay",
      CRYPTO: "https://crypto.cyberqeln.com/pay",
    };

    const base = baseUrls[method] || baseUrls["PAYME"];
    return `${base}?order=${orderId}&amount=${amount}&currency=UZS`;
  }

  private async deliverDigitalGoods(userId: string, items: any[]) {
    // Mock: add CyberCoins to user balance, activate skin, etc.
    console.log(`Delivering digital goods to user ${userId}:`, items.map((i) => i.product.name));
  }

  private async validatePromoCode(code: string): Promise<number> {
    const codes: Record<string, number> = {
      CYBER20: 20,
      WELCOME10: 10,
      CHAMP15: 15,
    };
    return codes[code.toUpperCase()] || 0;
  }
}

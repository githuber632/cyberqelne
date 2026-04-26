"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let ShopService = class ShopService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(filters) {
        const { category, search, page = 1, limit = 20, featured } = filters;
        const where = { isActive: true };
        if (category)
            where.category = category;
        if (featured !== undefined)
            where.featured = featured;
        if (search)
            where.name = { contains: search, mode: "insensitive" };
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
    async getProduct(id) {
        const product = await this.prisma.product.findFirst({
            where: { OR: [{ id }, { slug: id }], isActive: true },
        });
        if (!product)
            throw new common_1.NotFoundException("Товар не найден");
        return product;
    }
    async createOrder(userId, dto) {
        const productIds = dto.items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException("Один или несколько товаров недоступны");
        }
        let totalAmount = BigInt(0);
        const orderItems = dto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            totalAmount += product.price * BigInt(item.quantity);
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });
        let discount = 0;
        if (dto.promoCode) {
            discount = await this.validatePromoCode(dto.promoCode);
            totalAmount = totalAmount * BigInt(100 - discount) / BigInt(100);
        }
        const order = await this.prisma.order.create({
            data: {
                userId,
                totalAmount,
                paymentMethod: dto.paymentMethod,
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
        const paymentUrl = await this.initiatePayment(order.id, totalAmount, dto.paymentMethod);
        return { order, paymentUrl };
    }
    async handlePaymentCallback(orderId, success) {
        if (success) {
            const order = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: "PAID", paidAt: new Date() },
                include: { items: { include: { product: true } }, user: true },
            });
            const digitalItems = order.items.filter((i) => i.product.isDigital);
            if (digitalItems.length > 0) {
                await this.deliverDigitalGoods(order.userId, digitalItems);
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: { status: "DELIVERED" },
                });
            }
            return order;
        }
        else {
            return this.prisma.order.update({
                where: { id: orderId },
                data: { status: "CANCELLED" },
            });
        }
    }
    async initiatePayment(orderId, amount, method) {
        const baseUrls = {
            PAYME: "https://checkout.paycom.uz",
            CLICK: "https://my.click.uz/services/pay",
            UZCARD: "https://uzcard.uz/pay",
            HUMO: "https://humo.uz/pay",
            CRYPTO: "https://crypto.cyberqeln.com/pay",
        };
        const base = baseUrls[method] || baseUrls["PAYME"];
        return `${base}?order=${orderId}&amount=${amount}&currency=UZS`;
    }
    async deliverDigitalGoods(userId, items) {
        console.log(`Delivering digital goods to user ${userId}:`, items.map((i) => i.product.name));
    }
    async validatePromoCode(code) {
        const codes = {
            CYBER20: 20,
            WELCOME10: 10,
            CHAMP15: 15,
        };
        return codes[code.toUpperCase()] || 0;
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShopService);
//# sourceMappingURL=shop.service.js.map
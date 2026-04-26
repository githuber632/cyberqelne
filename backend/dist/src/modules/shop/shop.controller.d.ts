import { ShopService } from "./shop.service";
import { CreateOrderDto } from "./dto/create-order.dto";
export declare class ShopController {
    private shop;
    constructor(shop: ShopService);
    getProducts(q: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            featured: boolean;
            price: bigint;
            oldPrice: bigint | null;
            category: import(".prisma/client").$Enums.ProductCategory;
            stock: number;
            images: string[];
            tags: string[];
            isActive: boolean;
            isDigital: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProduct(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        featured: boolean;
        price: bigint;
        oldPrice: bigint | null;
        category: import(".prisma/client").$Enums.ProductCategory;
        stock: number;
        images: string[];
        tags: string[];
        isActive: boolean;
        isDigital: boolean;
    }>;
    createOrder(dto: CreateOrderDto, req: any): Promise<{
        order: {
            items: ({
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    slug: string;
                    featured: boolean;
                    price: bigint;
                    oldPrice: bigint | null;
                    category: import(".prisma/client").$Enums.ProductCategory;
                    stock: number;
                    images: string[];
                    tags: string[];
                    isActive: boolean;
                    isDigital: boolean;
                };
            } & {
                id: string;
                price: bigint;
                productId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            promoCode: string | null;
            fullName: string | null;
            address: string | null;
            city: string | null;
            phone: string | null;
            totalAmount: bigint;
            paymentId: string | null;
            paidAt: Date | null;
            discount: number;
        };
        paymentUrl: string;
    }>;
}

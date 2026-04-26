export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    paymentMethod: string;
    promoCode?: string;
    fullName: string;
    address?: string;
    city?: string;
    phone?: string;
}

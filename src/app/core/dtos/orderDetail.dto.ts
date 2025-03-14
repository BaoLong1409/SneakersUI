export interface OrderDetailDto {
    // orderId: string,
    productId: string,
    priceAtOrder: number,
    quantity: number,
    productName: string | null,
    imageUrl: string | null,
    colorId: string,
    colorName: string | null,
    sizeId: string,
    sizeNumber: number | null
}
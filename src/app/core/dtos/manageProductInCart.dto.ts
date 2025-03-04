export interface ManageProductInCartDto {
    productId: string,
    cartId: string | null,
    sizeId: string,
    colorId: string,
    quantity: number
}
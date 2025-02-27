import { ProductImageDto } from "./productImage.dto";

export interface DetailProductDto {
    id: string,
    name: string,
    description: string,
    color: string,
    price: number,
    sale: number,
    productImages: ProductImageDto[]
}
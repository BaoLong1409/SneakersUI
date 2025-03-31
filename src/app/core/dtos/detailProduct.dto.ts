import { CategoryDto } from "./category.dto";
import { ProductImageDto } from "./productImage.dto";

export interface DetailProductDto {
    productId: string,
    productName: string,
    // description: string,
    colorId: string,
    colorName: string,
    categories: CategoryDto[],
    price: number,
    sale: number,
    createdAt: Date,
    productImages: ProductImageDto[]
}
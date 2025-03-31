export interface AllProductDto {
    productId: string,
    productName: string,
    thumbnailImage: string,
    categoryName: string,
    brand: string,
    price: number,
    sale: number,
    rating: number,
    colorsAImages: {
        colorId: string,
        colorName: string,
        imageId: string,
        thumbnailUrl: string
    }[]
}
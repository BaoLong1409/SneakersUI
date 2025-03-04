export interface AllProductDto {
    id: string,
    name: string,
    thumbnailImage: string,
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
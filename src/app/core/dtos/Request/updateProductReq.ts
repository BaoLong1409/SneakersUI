import { ColorDto } from "../color.dto";
import { ImageUploadDto } from "../imageUpload.dto";
import { UploadSizeRequest } from "./uploadSizeReq";

export interface UpdateProductRequest {
    productId: string,
    productName: string,
    sale: number,
    price: number,
    color: ColorDto, 
    categoryName: string[],
    brand: string, 
    productImages: ImageUploadDto[],
    ordinalImageThumbnail: number,
    sizesQuantity: UploadSizeRequest[]
}
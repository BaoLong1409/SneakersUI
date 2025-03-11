import { WardType } from "./Ward";

export interface WardApi {
    total: number,
    data: WardType[],
    code: string
}
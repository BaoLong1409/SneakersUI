import { ProvinceType } from "./Province";

export interface ProvinceApi {
    total: number,
    data: ProvinceType[],
    code: string
}
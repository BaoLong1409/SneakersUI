import { DistrictType } from "./District";

export interface DistrictApi {
    total: number,
    data: DistrictType[],
    code: string
}
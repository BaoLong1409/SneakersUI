import { ShippingInfoDto } from "../shippingInfo.dto";

export interface ShippingInfoRes {
    message: string,
    data: ShippingInfoDto[]
}
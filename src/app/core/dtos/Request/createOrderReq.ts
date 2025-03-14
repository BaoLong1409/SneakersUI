import { OrderDetailDto } from "../orderDetail.dto";
import { OrderAddReq } from "./orderAddReq";

export interface CreateOrderReq {
    order: OrderAddReq,
    orderDetails: OrderDetailDto[]
}
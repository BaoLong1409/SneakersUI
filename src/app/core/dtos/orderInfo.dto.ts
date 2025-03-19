import { OrderStatusDto } from "./orderStatus.dto";

export interface OrderInfoDto {
    id: string,
    orderDate: Date,
    shippingDate: Date,
    totalMoney: number,
    note: string | null,
    fullName: string,
    phoneNumber: string,
    shippingAddress: string,
    shippingName: string,
    shippingPrice: number,
    minimumDeliveredTime: number,
    maximumDeliveredTime: number,
    paymentName: string,
    statusHistories: OrderStatusDto[]
}
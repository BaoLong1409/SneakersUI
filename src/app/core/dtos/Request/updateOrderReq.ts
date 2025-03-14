export interface UpdateOrderReq {
    orderId: string,
    fullName: string,
    phoneNumber: string,
    shippingAddress: string,
    orderDate: Date,
    shippingDate: Date | null,
    totalMoney: number,
    note: string | null,
    userId: string,
    shippingId: string,
    shippingInforId: string | null,
    paymentId: string
}
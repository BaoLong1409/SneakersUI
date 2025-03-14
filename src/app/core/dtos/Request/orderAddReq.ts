export interface OrderAddReq {
    fullName: string | null,
    phoneNumber: string | null,
    shippingAddress: string | null,
    orderDate: Date,
    shippingDate: Date | null,
    totalMoney: number,
    note: string | null,
    userId: string,
    shippingId: string | null,
    shippingInforId: string | null,
    paymentId: string | null
}
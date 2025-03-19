export interface ShippingInfoDto {
    id: string | null,
    fullName: string,
    email: string | null,
    phoneNumber: string,
    address: string,
    note: string | null,
    isMainAddress: number,
    userId: string
}
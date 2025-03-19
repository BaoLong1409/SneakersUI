export interface UpdateUserInfoRequest {
    id: string, 
    firstName: string,
    lastName: string,
    avatarFile: string | null,
    avatarName: string | null,
    phoneNumber: string,
}
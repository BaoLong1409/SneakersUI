export interface ProductReviewDto {
    id: string,
    commentContent: string | null,
    quality: number,
    updatedAt: Date,
    firstName: string,
    lastName: string,
    imageUrl: string[]
}
export interface ProductReviewRequest {
    commentContent: string | null,
    quality: number,
    image: string[] | null,
    userId: string,
    orderDetailId: string
}
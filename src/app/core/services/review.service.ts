import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ProductsAreWaitingReviewDto } from '../dtos/productsAreWaitingReview.dto';
import { ProductReviewRequest } from '../dtos/Request/productReviewReq';
import { ResponseMessageDto } from '../dtos/responseMessage.dto';
import { CommonService } from './common.service';
import { GetCommentsOfProductRequest } from '../dtos/Request/getCommentsOfProductReq';
import { ProductReviewDto } from '../dtos/productReview.dto';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiUrl: string = environment.apiUrl;
  private readonly token!: string | null;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly commonService: CommonService

  ) {
    this.token = this.commonService.token;
  }

  public getProductsAreWaitingReview(userId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.httpClient.get<ProductsAreWaitingReviewDto[]>(
      `${this.apiUrl}review/getToReview`,
      { params: { userId }, headers: headers }
    );
  }

  public reviewProduct(reviewReq: ProductReviewRequest) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.httpClient.post<ResponseMessageDto>(
      `${this.apiUrl}review/post`,
      reviewReq,
      {headers: headers}
    );
  }

  public getCommentsOfProduct(req: GetCommentsOfProductRequest) {
    let params = new HttpParams();

    Object.keys(req).forEach(key => {
      let value = (req as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value);
      }
    })

    return this.httpClient.get<ProductReviewDto[]>(
      `${this.apiUrl}review/getComment`,
      {params}
    );
  }
}

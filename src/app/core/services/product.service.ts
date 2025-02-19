import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureProductDto } from '../dtos/featureProduct.dto';
import { environment } from '../../environments/environment.development';
import { AllProductDto } from '../dtos/allProduct.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl: string = environment.apiUrl
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public getAllFeatureProducts() {
    return this.httpClient.get<FeatureProductDto[]>(`${this.apiUrl}product/getAllFeatureProducts`);
  }

  public getAllProducts() {
    return this.httpClient.get<AllProductDto[]>(`${this.apiUrl}product/getAll`);
  }

  public getRecommendProducts(userId: string) {
    return this.httpClient.get<AllProductDto[]>(`${this.apiUrl}product/getRecommendProduct`, { params: { userId }});
  }
}

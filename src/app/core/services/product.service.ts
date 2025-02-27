import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureProductDto } from '../dtos/featureProduct.dto';
import { environment } from '../../environments/environment.development';
import { AllProductDto } from '../dtos/allProduct.dto';
import { DetailProductDto } from '../dtos/detailProduct.dto';
import { ProductImageDto } from '../dtos/productImage.dto';

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

  public getDetailProduct(productId: string, productColor: string) {
    return this.httpClient.get<DetailProductDto>(`${this.apiUrl}product/getProductById`, { 
      params: { productId: productId, color: productColor }
    });
  }

  public getProductImageColors(productId: string) {
    return this.httpClient.get<ProductImageDto[]>(`${this.apiUrl}product/getImageProductColors`, {
      params: {productId}
    });
  }
}

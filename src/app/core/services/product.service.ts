import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureProductDto } from '../dtos/featureProduct.dto';
import { environment } from '../../environments/environment.development';
import { AllProductDto } from '../dtos/allProduct.dto';
import { DetailProductDto } from '../dtos/detailProduct.dto';
import { ProductImageDto } from '../dtos/productImage.dto';
import { ProductAvailableSizesDto } from '../dtos/productAvailableSizes.dto';
import { GetProductsByCategory } from '../dtos/Request/getProductsByCategoryReq';

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

  public getProductsWithCondition(priceFilter: number[]) {
    return this.httpClient.get<AllProductDto[]>(`${this.apiUrl}product/getAllWCondition`, { params: { priceFilter: priceFilter }});
  }

  public getProductsByCategory(categoryRequest: GetProductsByCategory) {
    let params = new HttpParams();

    Object.keys(categoryRequest).forEach(key => {
      const value = (categoryRequest as any)[key];
      params = params.set(key, value);
    })
    return this.httpClient.get<AllProductDto[]>(`${this.apiUrl}product/getAllByCategory`, { params});
  }

  public getRecommendProducts(userId: string) {
    return this.httpClient.get<AllProductDto[]>(`${this.apiUrl}product/getRecommendProduct`, { params: { userId }});
  }

  public getDetailProduct(productId: string, productColor: string) {
    return this.httpClient.get<DetailProductDto>(`${this.apiUrl}product/getProductById`, { 
      params: { productId: productId, color: productColor }
    });
  }

  public getImageColorsProduct(productId: string) {
    return this.httpClient.get<ProductImageDto[]>(`${this.apiUrl}product/getImageColorsProduct`, {
      params: {productId}
    });
  }

  public getAvailableSizes(productId: string, productColor: string) {
    return this.httpClient.get<ProductAvailableSizesDto[]>(`${this.apiUrl}product/getAvailableSizes`, {
      params: { productId: productId, colorName: productColor }
    });
  }

  public searchProducts(searchTerm: string) {
    console.log(searchTerm);
    
    return this.httpClient.get<AllProductDto[]>(`${this.apiUrl}product/searchAllProducts`, {
      params: { keyword: searchTerm }
    });
  }
}

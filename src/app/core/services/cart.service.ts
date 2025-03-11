import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ManageProductInCartDto } from '../dtos/manageProductInCart.dto';
import { ProductCartResponse } from '../dtos/productCartRes.dto';
import { ProductInCartDto } from '../dtos/productInCart.dto';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly apiUrl: string = environment.apiUrl
    constructor(
      private readonly httpClient: HttpClient
    ) { }
  
    public addProductToCart(productInfor: ManageProductInCartDto, userId: string) {
      return this.httpClient.post<ProductCartResponse>(`${this.apiUrl}cart/addProduct`, productInfor, {params: {
        userId: userId
      }});
    }

    public getProductsInCart(userId: string) {
      return this.httpClient.get<ProductInCartDto[]>(`${this.apiUrl}cart/getProduct`, {params: {
        userId: userId
      }});
    }

    public updateProductInCart(product: ManageProductInCartDto ,userId: string) {
      return this.httpClient.put<ProductCartResponse>(`${this.apiUrl}cart/updateProduct`, product , {params: {
        userId: userId
      }});
    }

    public deleteProductInCart(product: ManageProductInCartDto ,userId: string) {
      return this.httpClient.delete<ProductCartResponse>(`${this.apiUrl}cart/deleteProduct` , {
        params: {
        userId: userId
      },
      body: product
    });
    }
}

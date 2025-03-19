import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ShippingMethodDto } from '../dtos/shippingMethod.dto';
import { ShippingInfoDto } from '../dtos/shippingInfo.dto';
import { ShippingInfoRes } from '../dtos/Response/shippingInfoRes';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private readonly apiUrl: string = environment.apiUrl

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public addShippingAddress(shippingInfo: ShippingInfoDto) {
    return this.httpClient.post<ShippingInfoRes>(`${this.apiUrl}shipping/addUserAddress`, shippingInfo);
  }

  public getAllShippingMethods() {
      return this.httpClient.get<ShippingMethodDto[]>(`${this.apiUrl}shipping/getAll`);
  }

  public updateShippingAddress(shippingInfo: ShippingInfoDto) {
    return this.httpClient.put<ShippingInfoRes>(`${this.apiUrl}shipping/updateUserAddress`, shippingInfo);
  }

  public deleteShippingAddress(shippingInfoId: string | null) {
    if (shippingInfoId == null) {
      return of();
    }
    
    return this.httpClient.delete<ShippingInfoRes>(`${this.apiUrl}shipping/deleteUserAddress`, {
      params: {shippingInfoId: shippingInfoId}
    });
  }

  public getAllUserAddresses(userId: string) {
    return this.httpClient.get<ShippingInfoDto[]>(`${this.apiUrl}shipping/getUserAddress`, {
      params: {userId: userId}
    });
  }
}

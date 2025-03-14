import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ShippingMethodDto } from '../dtos/shippingMethod.dto';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private readonly apiUrl: string = environment.apiUrl

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public getAllShippingMethods() {
      return this.httpClient.get<ShippingMethodDto[]>(`${this.apiUrl}shipping/getAll`);
    }
}

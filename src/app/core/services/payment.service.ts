import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PaymentDto } from '../dtos/payment.dto';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private readonly httpClient: HttpClient) {}

  public getAllPayments() {
    return this.httpClient.get<PaymentDto[]>(`${this.apiUrl}payment/getAll`);
  }
}

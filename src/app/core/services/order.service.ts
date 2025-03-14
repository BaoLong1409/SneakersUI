import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { OrderDetailDto } from '../dtos/orderDetail.dto';
import { UpdateOrderReq } from '../dtos/Request/updateOrderReq';
import { CommonRes } from '../dtos/Response/commonRes';
import { CreateOrderRes } from '../dtos/Response/createOrderRes';
import { CreateOrderReq } from '../dtos/Request/createOrderReq';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly apiUrl: string = environment.apiUrl;
  
    constructor(private readonly httpClient: HttpClient) {}

    public createOrder(order: CreateOrderReq) {
      return this.httpClient.post<CreateOrderRes>(`${this.apiUrl}order/add`, order);
    }
  
    public getOrderDetails(orderId: string) {
      return this.httpClient.get<OrderDetailDto[]>(`${this.apiUrl}order/getOrderDetails`, {params: {
        orderId: orderId
      }});
    }

    public updateOrder(updateOrderReq: UpdateOrderReq) {
      return this.httpClient.put<CommonRes>(`${this.apiUrl}order/update`, updateOrderReq);
    }

    public payVnpay(orderId: string) {
      return this.httpClient.get<{ url: string }>(`${this.apiUrl}order/pay/vnpay`, {params: {
        orderId: orderId
      }});
    }

    public returnVnpay(query: string) {
      return this.httpClient.get<CommonRes>(`${this.apiUrl}order/vnpay-return?${query}`);
    }
}

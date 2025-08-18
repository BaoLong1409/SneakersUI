import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../core/commonComponent/base.component';
import { SharedModule } from '../../../../core/commonComponent/SharedModule/SharedModule';
import { AsyncPipe } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  takeUntil,
  tap,
} from 'rxjs';
import { OrdersDto } from '../../../../core/dtos/orders.dto';
import { OrderService } from '../../../../core/services/order.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonRes } from '../../../../core/dtos/Response/commonRes';

@Component({
  selector: 'app-order-manage',
  imports: [SharedModule, AsyncPipe, InfiniteScrollDirective, DatePipe],
  templateUrl: './order-manage.component.html',
  styleUrl: './order-manage.component.scss',
})
export class OrderManageComponent extends BaseComponent implements OnInit {
  private ordersSubject = new BehaviorSubject<OrdersDto[]>([]);

  public orders$: Observable<OrdersDto[]> = this.ordersSubject.asObservable();

  public orderStatuses: string[] = [];
  public dateValue!: Date[];

  public offset: number = 10;
  public limit: number = 10;
  public status: string = 'Pending';
  public stepValue: number = 1;

  private scrollLoading: boolean = false;
  private copyOrdersSubject = new BehaviorSubject<OrdersDto[]>([]);

  constructor(
    private readonly orderService: OrderService,
    private readonly toastService: ToastService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super();
    this.status = activatedRoute.snapshot.paramMap.get('status') ?? 'Pending';
    switch (this.status) {
      case 'Pending':
        this.stepValue = 1;
        break;
      case 'Success':
        this.stepValue = 2;
        break;
      case 'Delivering':
        this.stepValue = 3;
        break;
      case 'Delivered':
        this.stepValue = 4;
        break;
      default:
        this.stepValue = 1;
        break;
    }
  }
  ngOnInit(): void {
    this.orderStatuses = ['Pending', 'Success', 'Delivering', 'Delivered'];

    this.orderService
      .getOrdersByLimit(0, 10, this.status)
      .pipe(
        tap((orders: OrdersDto[]) => {
          this.ordersSubject.next(orders);
          this.copyOrdersSubject.next(orders);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public getOrders(status: string, step: number) {
    if (step == this.stepValue) {
      return;
    } else {
      window.location.href = `/Admin/Order/Manage/${status}`;
      this.stepValue = step;
      this.orderService
        .getOrdersByLimit(0, 10, status)
        .pipe(
          tap((orders: OrdersDto[]) => {
            this.ordersSubject.next(orders);
          this.copyOrdersSubject.next(orders);
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe();
    }
  }

  public onScroll() {
    if (this.scrollLoading) return;
    this.scrollLoading = true;
    this.orderService
      .getOrdersByLimit(this.offset, this.limit, this.status)
      .pipe(
        tap((orders: OrdersDto[]) => {
          this.ordersSubject.next([...this.ordersSubject.value, ...orders]);
          this.copyOrdersSubject.next(this.ordersSubject.value);
          this.offset += this.limit;
          this.scrollLoading = false;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public updateOrderStatus(order: OrdersDto) {
    this.orderService
      .updateOrderStatus({
        orderId: order.orderId,
        orderStatus: order.orderStatus,
      })
      .pipe(
        tap((res: CommonRes) => {
          this.toastService.success(res.message);
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.fail(err.error.message);
          return EMPTY;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public dateFilter() {
    if (this.dateValue[1] == null) {
      this.ordersSubject.next(this.copyOrdersSubject.value.filter((o) => {
        const orderDate = new Date(o.orderDate);
        return orderDate == this.dateValue[0];
      }));
    } else {
      this.ordersSubject.next(this.copyOrdersSubject.value.filter((o) => {
        const orderDate = new Date(o.orderDate);
        return orderDate >= this.dateValue[0] && orderDate <= this.dateValue[1];
      }));
    }
  }
}

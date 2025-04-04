import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { OrderService } from '../../../core/services/order.service';
import { BehaviorSubject, Observable, takeUntil, tap } from 'rxjs';
import { CommonService } from '../../../core/services/common.service';
import { AsyncPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { OrdersDto } from '../../../core/dtos/orders.dto';

@Component({
  selector: 'app-all-order',
  imports: [StepperModule, AsyncPipe, CardModule],
  providers: [AsyncPipe],
  templateUrl: './all-order.component.html',
  styleUrl: './all-order.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AllOrderComponent extends BaseComponent implements OnInit {
  public allOrderSubject = new BehaviorSubject<OrdersDto[]>([]);
  public allOrders$: Observable<OrdersDto[]> =
    this.allOrderSubject.asObservable();
  constructor(
    private readonly orderService: OrderService,
    private readonly commonService: CommonService,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.orderService
      .getAllOrders(this.commonService.userInfor.id)
      .pipe(
        tap((allOrders: OrdersDto[]) => {
          this.allOrderSubject.next(allOrders);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public goToOrderDetail(orderId: string) {
    this.router.navigateByUrl(`OrderDetail/${orderId}`);
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { OrderService } from '../../../core/services/order.service';
import { BehaviorSubject, Observable, takeUntil, tap } from 'rxjs';
import { AllOrdersDto } from '../../../core/dtos/allOrders.dto';
import { CommonService } from '../../../core/services/common.service';
import { AsyncPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-order',
  imports: [
    StepperModule,
    AsyncPipe,
    CardModule
  ],
  providers:[
    AsyncPipe
  ],
  templateUrl: './all-order.component.html',
  styleUrl: './all-order.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AllOrderComponent extends BaseComponent implements OnInit {
  public allOrderSubject = new BehaviorSubject<AllOrdersDto[]>([]);
  public allOrders$: Observable<AllOrdersDto[]> =  this.allOrderSubject.asObservable();
  constructor(
    private readonly orderService: OrderService,
    private readonly commonService: CommonService,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
      this.orderService.getAllOrders(this.commonService.userInfor.id).pipe(
        tap((allOrders: AllOrdersDto[]) => {
          this.allOrderSubject.next(allOrders)
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
  }

  public goToOrderDetail(orderId: string) {
    this.router.navigateByUrl(`OrderDetail/${orderId}`);
  }
}

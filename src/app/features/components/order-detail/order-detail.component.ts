import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap } from 'rxjs';
import { OrderDetailDto } from '../../../core/dtos/orderDetail.dto';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OrderInfoDto } from '../../../core/dtos/orderInfo.dto';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AddDaysPipe } from '../../../core/pipe/add-days.pipe';
import { OrderStatusDto } from '../../../core/dtos/orderStatus.dto';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-order-detail',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    AddDaysPipe,
    TimelineModule
],
  providers: [
    DatePipe,
    AddDaysPipe
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailComponent extends BaseComponent implements OnInit {
  public orderDetails: OrderDetailDto[] = [];
  public orderInfo!: OrderInfoDto;
  public orderNewestStatus!: OrderStatusDto;

  public orderId!: string; 
  public isCopied: boolean = false;
  constructor(
    private readonly orderService: OrderService,
    private readonly route: ActivatedRoute,
    private readonly datePipe: DatePipe
  ) {
    super();
    this.orderId = this.route.snapshot.paramMap.get('orderId') ?? "";
  }
  
  ngOnInit(): void {
    this.orderService.getOrderDetails(this.orderId).pipe(
      tap((orderDetails: OrderDetailDto[]) => {
        this.orderDetails = orderDetails;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();

    this.orderService.getOrderInfo(this.orderId).pipe(
      tap((orderInfo: OrderInfoDto) => {
        this.orderInfo = orderInfo;
        this.orderNewestStatus = orderInfo.statusHistories.reduce((item, max) => item.updatedAt > max.updatedAt ? item : max, orderInfo.statusHistories[0]);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public copyText(): void {
    navigator.clipboard.writeText(this.orderId).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    });
  }

  public checkNearestDate(date: Date): boolean {
    const today = new Date();

    const nearestDate: Date = this.orderInfo.statusHistories
    .map(date => new Date(date.updatedAt))
    .filter(date => !isNaN(date.getTime()))
    .reduce((nearest, current) => Math.abs(current.getTime() - today.getTime()) < Math.abs(nearest.getTime() - today.getTime()) ? current : nearest);

    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    if (date.getTime() == nearestDate.getTime()) {
      return true;
    }
    return false;
  }
}

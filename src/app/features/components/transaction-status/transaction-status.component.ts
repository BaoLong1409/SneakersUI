import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, takeUntil, tap } from 'rxjs';
import { CommonRes } from '../../../core/dtos/Response/commonRes';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-transaction-status',
  imports: [],
  templateUrl: './transaction-status.component.html',
  styleUrl: './transaction-status.component.scss'
})
export class TransactionStatusComponent extends BaseComponent implements OnInit{
  public transRes!: CommonRes;
  constructor(
    private readonly orderService: OrderService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    super();
  }


  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      // Convert ParamMap thành object key-value
      const queryParams: Record<string, string> = {};
      params.keys.forEach(key => {
        queryParams[key] = params.get(key) ?? '';
      });
  
      // Convert object thành query string
      const queryString = new URLSearchParams(queryParams).toString();
  
      if (queryString) {
        this.sendQueryToServer(queryString);
      }
    });
  }
  
  private sendQueryToServer(query: string) {
    this.orderService.returnVnpay(query).pipe(
      tap((res: CommonRes) => {
        console.log(res);
        
        this.transRes = res;
      }),
      catchError((res: HttpErrorResponse) => {
        this.transRes = res.error;
        return EMPTY;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public goToAllProducts() {
    this.router.navigateByUrl("/All");
  }
  
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'primeng/basecomponent';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { CurrencyPipe } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ProductDto } from '../../../core/dtos/product.dto';
import { ProductService } from '../../../core/services/product.service';
import { tap } from 'rxjs';
import { AllProductDto } from '../../../core/dtos/allProduct.dto';
import { Router } from '@angular/router';


@Component({
  selector: 'app-all-products',
  imports: [
    DropdownModule,
    FormsModule,
    SliderModule,
    CurrencyPipe,
    DataViewModule
  ],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AllProductsComponent extends BaseComponent implements OnInit{
  public categoriesOptions: MenuItem[] = [];
  public sortOptions: MenuItem[] = [
    { label: 'Giá từ thấp đến cao', value: 'price' },
    { label: 'Giá từ cao đến thấp', value: '!price' },
  ]
  public priceFilterValue: number[] = [1, 100];
  public products: AllProductDto[] = [];

  public sortOrder!: number;
  public sortField!: string;


  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
      this.productService.getAllProducts().pipe(
        tap((allProducts: AllProductDto[]) => {
          this.products = allProducts;
          console.log(this.products);
          
        })
      )
      .subscribe();
  }

  public onSortChange(event: any) {
    let value = event.value;
    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  public goToDetailProduct(productId: string) {
    this.router.navigateByUrl(`Detail/${productId}`);
  }
}

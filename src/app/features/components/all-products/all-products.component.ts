import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { CurrencyPipe } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ProductDto } from '../../../core/dtos/product.dto';
import { ProductService } from '../../../core/services/product.service';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AllProductDto } from '../../../core/dtos/allProduct.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryDto } from '../../../core/dtos/category.dto';
import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'app-all-products',
  imports: [
    DropdownModule,
    FormsModule,
    SliderModule,
    CurrencyPipe,
    DataViewModule,
  ],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AllProductsComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  public categoriesOptions: MenuItem[] = [];
  public brandOptions: MenuItem[] = [];
  public selectedCategory: { name: string } | null = null;
  public selectedBrand: { brand: string } | null = null;
  public sortOptions: MenuItem[] = [
    { label: 'Giá từ thấp đến cao', value: 'price' },
    { label: 'Giá từ cao đến thấp', value: '!price' },
  ];
  public priceFilterValue: number[] = [1, 100];
  public products: AllProductDto[] = [];

  public sortOrder!: number;
  public sortField!: string;

  constructor(
    private productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly commonService: CommonService,
    private router: Router,
    private readonly activateRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {

    this.categoryService
      .getAllCategories()
      .pipe(
        tap((res: CategoryDto[]) => {
          this.categoriesOptions = [...new Set(res.map((p) => p.categoryName))].map(
            (name) => ({ name })
          );
          this.brandOptions = [...new Set(res.map((p) => p.brand))].map(
            (brand) => ({ brand })
          );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.activateRoute.queryParamMap
      .pipe(
        switchMap((params) => {
          const searchTerm = params.get('search');
          if (searchTerm) {
            return this.productService.searchProducts(searchTerm ?? '').pipe(
              tap((products: AllProductDto[]) => {
                this.products = products;
              })
            );
          }
          return this.productService
          .getAllProducts()
          .pipe(
            tap((allProducts: AllProductDto[]) => {
              this.products = allProducts;
            })
          )
          
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public onSortChange(event: any) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  public goToDetailProduct(productId: string, colorName: string) {
    console.log(Object.keys(this.commonService.userInfor).length);
    if (Object.keys(this.commonService.userInfor).length > 0) {
      if (this.commonService.userInfor.rolesName.includes("Admin")) {
        this.router.navigateByUrl(`Admin/Update/${productId}/${colorName}`);
      } else{
        this.router.navigateByUrl(`Detail/${productId}/${colorName}`);
      }
    } else {
      this.router.navigateByUrl(`Detail/${productId}/${colorName}`);
    }
    
  }

  public filterAllProducts() {
    const priceArray = this.priceFilterValue.map((x) => x * 50);
    this.productService
      .getProductsWithCondition(priceArray)
      .pipe(
        tap((products: AllProductDto[]) => {
          this.products = products;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public filterProducts(event: Event) {
    this.productService
      .getProductsByCategory({
        categoryName: this.selectedCategory?.name ?? null,
        brandName: this.selectedBrand?.brand ?? null,
      })
      .pipe(
        tap((products: AllProductDto[]) => {
          this.products = products;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }
}

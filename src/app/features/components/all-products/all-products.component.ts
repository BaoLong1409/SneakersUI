import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { CurrencyPipe } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ProductDto } from '../../../core/dtos/product.dto';
import { ProductService } from '../../../core/services/product.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { AllProductDto } from '../../../core/dtos/allProduct.dto';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryDto } from '../../../core/dtos/category.dto';

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
export class AllProductsComponent extends BaseComponent implements OnInit {
  public categoriesOptions: MenuItem[] = [];
  public brandOptions: MenuItem[] = [];
  public selectedCategory : {name: string} | null = null;
  public selectedBrand : {brand: string} | null = null;
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
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.productService
      .getAllProducts()
      .pipe(
        tap((allProducts: AllProductDto[]) => {
          this.products = allProducts;
        })
      )
      .subscribe();

      this.categoryService.getAllCategories().pipe(
        tap((res: CategoryDto[]) => {
          this.categoriesOptions = [...new Set(res.map(p => p.name))].map(name => ({name}));
          this.brandOptions = [...new Set(res.map(p => p.brand))].map(brand => ({brand}))
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
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
    this.router.navigateByUrl(`Detail/${productId}/${colorName}`);
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
    this.productService.getProductsByCategory({categoryName: this.selectedCategory?.name ?? null, brandName: this.selectedBrand?.brand ?? null}).pipe(
      tap((products: AllProductDto[]) => {
        this.products = products;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }
}

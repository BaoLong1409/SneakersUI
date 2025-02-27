import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { DetailProductDto } from '../../../core/dtos/detailProduct.dto';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SizeService } from '../../../core/services/size.service';
import { SizeDto } from '../../../core/dtos/size.dto';
import { ColorService } from '../../../core/services/color.service';
import { ProductImageDto } from '../../../core/dtos/productImage.dto';

@Component({
  selector: 'app-detail-product',
  imports: [
    GalleriaModule,
    FormsModule,
    ScrollPanelModule
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DetailProductComponent extends BaseComponent implements OnInit{
  public productId!: string;
  private productColor!: string;
  public detailProduct !: DetailProductDto;
  public sizeNumbers: SizeDto[] = [];
  public productColors: ProductImageDto[] = [];
  public selectedSize!: number;
  constructor(
    private productService: ProductService,
    private sizeService: SizeService,
    private colorService: ColorService,
    private route: ActivatedRoute
  ) {
    super();
  }

  override ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? "";
    this.productColor = this.route.snapshot.paramMap.get('colorName') ?? "";
    this.productService.getDetailProduct(this.productId, this.productColor).pipe(
      tap((detailProduct: DetailProductDto) => {
        this.detailProduct = detailProduct;
      })
    ).subscribe();

    this.sizeService.getAllSizes().pipe(
      tap((sizes: SizeDto[]) => {
        this.sizeNumbers = sizes;
        this.selectedSize = sizes[0].sizeNumber;
      })
    ).subscribe();

    this.productService.getProductImageColors(this.productId).pipe(
      tap((colors: ProductImageDto[]) => {
        this.productColors = colors;
      })
    ).subscribe();
  }

  public selectSize(size: number) {
    this.selectedSize = size;
  }
}

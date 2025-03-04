import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from 'primeng/basecomponent';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { DetailProductDto } from '../../../core/dtos/detailProduct.dto';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SizeService } from '../../../core/services/size.service';
import { SizeDto } from '../../../core/dtos/size.dto';
import { ProductImageDto } from '../../../core/dtos/productImage.dto';
import { ProductAvailableSizesDto } from '../../../core/dtos/productAvailableSizes.dto';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../core/services/toast.service';
import { CartService } from '../../../core/services/cart.service';
import { UserDto } from '../../../core/dtos/user.dto';
import { ProductCartResponse } from '../../../core/dtos/productCartRes.dto';
import { EnumProductCart } from '../../../core/enum/enumProductCart';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-detail-product',
  imports: [
    GalleriaModule,
    FormsModule,
    ScrollPanelModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [
    MessageService,
    ToastService
  ]
  ,
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DetailProductComponent extends BaseComponent implements OnInit{
  public productId!: string;
  public productColor!: string;
  public productQuantity!: number | undefined;
  public productQuantityAddToCart: number = 1;
  public detailProduct !: DetailProductDto;
  public sizeNumbers: SizeDto[] = [];
  public productImageColors: ProductImageDto[] = [];
  public availableSizes: ProductAvailableSizesDto[] = [];
  public selectedSize!: number;
  private productSizeId!: string;
  private userInfor!: UserDto;
  constructor(
    private productService: ProductService,
    private sizeService: SizeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private cartService: CartService
  ) {
    super();
    if (typeof localStorage != 'undefined') {
      const userInfor = localStorage.getItem("userInfor");
      this.userInfor = userInfor ? JSON.parse(userInfor) : {} as UserDto;
    }
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

    this.productService.getImageColorsProduct(this.productId).pipe(
      tap((colors: ProductImageDto[]) => {
        this.productImageColors = colors;
      })
    ).subscribe();

    this.productService.getAvailableSizes(this.productId, this.productColor).pipe(
      tap((availableSizes: ProductAvailableSizesDto[]) => {
        this.availableSizes = availableSizes;
      })
    ).subscribe();
  }

  public selectSize(size: SizeDto) {
    if (!this.availableSizes.find(s => s.sizeNumber === size.sizeNumber)) {

    } else {
      this.selectedSize = size.sizeNumber;
      this.productSizeId = size.id;
      const sizeObj = this.availableSizes.find(s => s.sizeNumber === size.sizeNumber);
      this.productQuantity = sizeObj ? sizeObj.quantity : undefined;
    }
  }

  public goToOtherColor(colorName: string) {
    if (this.productColor == colorName) {

    } else {
      window.location.href = `/Detail/${this.productId}/${colorName}`;
    }
  }

  public checkAvailableSizes(sizeNumber: number) : boolean {
    return !!this.availableSizes.find(s => s.sizeNumber === sizeNumber) ;
  }

  public addProductToCart() {
    this.cartService.addProductToCart({
      productId: this.productId,
      sizeId: this.productSizeId,
      cartId: null,
      colorId: this.productImageColors[0].colorId,
      quantity: this.productQuantityAddToCart
    }, this.userInfor.id).pipe(
      tap((res: ProductCartResponse) => {  
        switch (res.status) {
          case EnumProductCart.Success:
            this.toastService.success(`${res.message}`)
            break;
          default:
            this.toastService.fail(`${res.message}`)
            break;
        }
      }
      )
    ).subscribe({
      error: (res: HttpErrorResponse) => {
        switch (res.error.status) {
          case EnumProductCart.CartNotFound:
            this.toastService.fail(res.error.message)
            break;
          case EnumProductCart.ProductNotFound:
            this.toastService.fail(res.error.message)
            break;
          case EnumProductCart.NotEnoughInStock:
            this.toastService.fail(res.error.message)
            break;
          default:
            this.toastService.fail(res.error.message)
            break;
        }
      }
    });
  }
}

import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, finalize, switchMap, takeUntil, tap } from 'rxjs';
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
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../../core/services/common.service';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { OrderService } from '../../../core/services/order.service';
import { OrderAddReq } from '../../../core/dtos/Request/orderAddReq';
import { OrderDetailDto } from '../../../core/dtos/orderDetail.dto';
import { CreateOrderReq } from '../../../core/dtos/Request/createOrderReq';
import { CreateOrderRes } from '../../../core/dtos/Response/createOrderRes';
import { CardModule } from 'primeng/card';
import { ReviewService } from '../../../core/services/review.service';
import { ProductReviewDto } from '../../../core/dtos/productReview.dto';
import { RatingModule } from 'primeng/rating';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-detail-product',
  imports: [
    GalleriaModule,
    FormsModule,
    ScrollPanelModule,
    InputNumberModule,
    ToastModule,
    CardModule,
    RatingModule,
    ImageModule
  ],
  providers: [MessageService, ToastService],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DetailProductComponent extends BaseComponent implements OnInit {
  public commentsSubject = new BehaviorSubject<ProductReviewDto[]>([]);
  public comments$ = this.commentsSubject.asObservable();

  public productId!: string;
  public productColor!: string;
  public productQuantity!: number | undefined;
  public productQuantityAddToCart: number = 1;
  public detailProduct!: DetailProductDto;
  public sizeNumbers: SizeDto[] = [];
  public productImageColors: ProductImageDto[] = [];
  public availableSizes: ProductAvailableSizesDto[] = [];
  public selectedSize!: number;
  public thumbnailPosition: 'left' | 'bottom' = 'left';

  private productSizeId!: string;
  private userInfor!: UserDto;
  constructor(
    private readonly productService: ProductService,
    private readonly reviewService: ReviewService,
    private readonly sizeService: SizeService,
    private readonly orderService: OrderService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly cartService: CartService,
    private readonly commonService: CommonService
  ) {
    super();
    if (typeof localStorage != 'undefined') {
      const userInfor = localStorage.getItem('userInfor');
      this.userInfor = userInfor ? JSON.parse(userInfor) : ({} as UserDto);
    }
  }

  ngOnInit(): void {
    this.updateThumbnailPosition(window.innerWidth);
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';
    this.productColor = this.route.snapshot.paramMap.get('colorName') ?? '';
    this.productService
      .getDetailProduct(this.productId, this.productColor)
      .pipe(
        tap((detailProduct: DetailProductDto) => {
          this.detailProduct = detailProduct;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.sizeService
      .getAllSizes()
      .pipe(
        tap((sizes: SizeDto[]) => {
          this.sizeNumbers = sizes;
          this.selectedSize = sizes[0].sizeNumber;
        })
      )
      .subscribe();

    this.productService
      .getImageColorsProduct(this.productId)
      .pipe(
        tap((productImageColors: ProductImageDto[]) => {
          this.productImageColors = productImageColors;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.productService
      .getAvailableSizes(this.productId, this.productColor)
      .pipe(
        tap((availableSizes: ProductAvailableSizesDto[]) => {
          this.availableSizes = availableSizes;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

      this.reviewService.getCommentsOfProduct({productId: this.productId, colorName: this.productColor}).pipe(
        tap((comments: ProductReviewDto[]) => {
          this.commentsSubject.next(comments);
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.fail(err.error.message);
          return EMPTY;
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
  }

  public selectSize(size: SizeDto) {
    if (!this.availableSizes.find((s) => s.sizeNumber === size.sizeNumber)) {
    } else {
      this.selectedSize = size.sizeNumber;
      this.productSizeId = size.id;
      const sizeObj = this.availableSizes.find(
        (s) => s.sizeNumber === size.sizeNumber
      );
      this.productQuantity = sizeObj ? sizeObj.quantity : undefined;
      this.productQuantityAddToCart = 1;
    }
  }

  public goToOtherColor(colorName: string) {
    if (this.productColor == colorName) {
    } else {
      window.location.href = `/Detail/${this.productId}/${colorName}`;
    }
  }

  public checkAvailableSizes(sizeNumber: number): boolean {
    return !!this.availableSizes.find((s) => s.sizeNumber === sizeNumber);
  }

  public addProductToCart() {
    this.cartService
      .addProductToCart(
        {
          productId: this.productId,
          sizeId: this.productSizeId,
          cartId: null,
          colorId:
            this.productImageColors.find(
              (x) => x.colorName === this.productColor
            )?.colorId || '',
          quantity: this.productQuantityAddToCart,
        },
        this.userInfor.id
      )
      .pipe(
        tap((res: ProductCartResponse) => {
          switch (res.status) {
            case EnumProductCart.Success:
              this.toastService.success(`${res.message}`);
              break;
            default:
              this.toastService.fail(`${res.message}`);
              break;
          }
        }),
        finalize(() => {
          this.commonService.immediateSubject.next(true);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        error: (res: HttpErrorResponse) => {
          switch (res.error.status) {
            case EnumProductCart.CartNotFound:
              this.toastService.fail(res.error.message);
              break;
            case EnumProductCart.ProductNotFound:
              this.toastService.fail(res.error.message);
              break;
            case EnumProductCart.NotEnoughInStock:
              this.toastService.fail(res.error.message);
              break;
            default:
              this.toastService.fail(res.error.message);
              break;
          }
        },
      });
  }

  public BuyProduct() {
    const order: OrderAddReq = {
      fullName: null,
      phoneNumber: null,
      shippingAddress: null,
      orderDate: new Date(),
      shippingDate: null,
      totalMoney: this.detailProduct.price,
      note: null,
      userId: this.commonService.userInfor.id,
      shippingId: null,
      shippingInforId: null,
      paymentId: null,
    };
    const orderDetails: OrderDetailDto[] = [
      {
        productId: this.productId,
        priceAtOrder: this.detailProduct.price,
        quantity: this.productQuantityAddToCart,
        productName: null,
        imageUrl: null,
        colorId: this.productImageColors.find(
          (x) => x.colorName === this.productColor
        )?.colorId || '',
        colorName: null,
        sizeId: this.productSizeId,
        sizeNumber: null,
      }
    ];

    const createOrderReq: CreateOrderReq = {
      order: order,
      orderDetails: orderDetails
    };
    this.orderService.createOrder(createOrderReq).pipe(
      tap((res: CreateOrderRes) => {
        this.toastService.success(res.message);
        this.router.navigateByUrl(`Order/${res.orderId}`);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateThumbnailPosition((event.target as Window).innerWidth);
  }

  private updateThumbnailPosition(width: number) {
    if (width <= 768) {
      this.thumbnailPosition = 'bottom';
    } else {
      this.thumbnailPosition = 'left';
    }
  }
}

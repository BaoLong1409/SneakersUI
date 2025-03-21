import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { LanguageSelect } from '../../dtos/languageSelect.dto';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { DomService } from '../../services/dom.service';
import { UserDto } from '../../dtos/user.dto';
import { catchError, debounceTime, EMPTY, Subject, switchMap, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ProductInCartDto } from '../../dtos/productInCart.dto';
import { CartService } from '../../services/cart.service';
import { CommonService } from '../../services/common.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../services/toast.service';
import { ManageProductInCartDto } from '../../dtos/manageProductInCart.dto';
import { EnumProductCart } from '../../enum/enumProductCart';
import { ProductCartResponse } from '../../dtos/productCartRes.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-app-header',
  imports: [
    Select,
    FormsModule,
    ButtonModule,
    RouterLink,
    Menu,
    TranslateModule,
    AvatarModule,
    OverlayBadgeModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    ToastService,
    ConfirmationService
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('settingIcon') settingIcon!: ElementRef;

  private updateQuantitySubject = new Subject<ManageProductInCartDto>();
  private updateQuantity$ = this.updateQuantitySubject.asObservable();

  public languages!: LanguageSelect[];
  public selectedLanguage!: LanguageSelect;
  public isChecked!: boolean;
  public items!: MenuItem[];
  public badgeValue: number = 0;
  public profileItems: MenuItem[] | undefined;
  public productsInCart: ProductInCartDto[] = [];
  public isCartOpen: boolean = false;
  private theme!: string;

  public userInfor!: UserDto;

  constructor(
    private translate: TranslateService,
    private themeService: ThemeService,
    private domService: DomService,
    private router: Router,
    private cartService: CartService,
    private commonService: CommonService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {
    if (typeof localStorage !== 'undefined') {
      const userInfor = localStorage.getItem('userInfor');
      this.userInfor = userInfor ? JSON.parse(userInfor) : ({} as UserDto);
    }
    if (typeof sessionStorage !== 'undefined') {
      const themeFromStorage = sessionStorage.getItem('theme');
      this.theme = themeFromStorage || 'light';
    }
  }

  ngOnInit(): void {
    this.profileItems = [
      {
        label: 'Options',
        items: [
          {
            label: 'All Your Order',
            icon: 'fa-solid fa-truck-fast',
            command: () => {
              this.router.navigateByUrl("AllOrder");
            }
          },
          {
            label: 'Profile settings',
            icon: 'pi pi-user',
            command: () => {
              this.router.navigateByUrl("Profile/Setting");
            }
          },
          {
            label: 'Change Password',
            icon: 'pi pi-lock',
            command: () => {
              this.router.navigateByUrl("Password/Change");
            }
          },
          {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            command: () => {
              localStorage.removeItem('token');
              localStorage.removeItem('userInfor');
              this.router.navigateByUrl('/Login');
            },
          },
        ],
      },
    ];

    this.themeService.themeIsChecked$
      .pipe(
        tap((value: boolean) => {
          this.isChecked = value;
        })
      )
      .subscribe();

    this.languages = [
      { name: 'Việt Nam', code: 'vn' },
      { name: 'English', code: 'en' },
    ];

    this.selectedLanguage = this.languages[1];
    if (this.userInfor) {
      if (this.userInfor.theme == 'dark') {
        this.themeService.themeIsCheckedSubject.next(false);
      } else if (this.userInfor.theme == 'light') {
        this.themeService.themeIsCheckedSubject.next(true);
      }
    } else {
      if (this.theme == 'dark') {
        this.themeService.themeIsCheckedSubject.next(false);
      } else if (this.theme == 'light') {
        this.themeService.themeIsCheckedSubject.next(true);
      }
    }

    this.initMenu();
  }

  ngAfterViewInit(): void {
    this.commonService.stateImmediate$
      .pipe(
        switchMap(() => {
          return this.cartService.getProductsInCart(this.userInfor.id).pipe(
            tap((productsInCart: ProductInCartDto[]) => {
              this.productsInCart = productsInCart;
              this.badgeValue = productsInCart.length;
            })
          );
        })
      )
      .subscribe();

    //Update Quantity
    this.updateQuantity$
      .pipe(
        debounceTime(1000),
        switchMap((product: ManageProductInCartDto) => {
          return this.cartService
            .updateProductInCart(product, this.commonService.userInfor.id)
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
              catchError((error: HttpErrorResponse) => {
                switch (error.error.status) {
                  case EnumProductCart.CartNotFound:
                    this.toastService.fail(error.error.message);
                    break;
                  case EnumProductCart.ProductNotFound:
                    this.toastService.fail(error.error.message);
                    break;
                  case EnumProductCart.NotEnoughInStock:
                    this.toastService.fail(error.error.message);
                    break;
                  default:
                    this.toastService.fail(error.error.message);
                    break;
                }
                return EMPTY;
              })
            );
        })
      )
      .subscribe();
  }

  private initMenu(): void {
    this.translate.get('header.settingLabel').subscribe((settingLabel) => {
      this.items = [
        {
          label: settingLabel,
        },
      ];
    });
  }

  public changeLanguage(languageCode: string): void {
    console.log(languageCode);
    this.translate.use(languageCode);
    localStorage.setItem('language', languageCode);
    this.initMenu();
  }

  public changeTheme(): void {
    if (this.domService.containElement('my-app-dark')) {
      this.themeService.toggleTheme('light').subscribe();
      sessionStorage.setItem('theme', 'light');
    } else {
      this.themeService.toggleTheme('dark').subscribe();
      sessionStorage.setItem('theme', 'dark');
    }
  }

  public addSpin(): void {
    this.settingIcon.nativeElement.classList.add('pi-spin');
  }

  public removeSpin(): void {
    this.settingIcon.nativeElement.classList.remove('pi-spin');
  }

  public toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;

    // Prevent scrolling when cart is open
    if (this.isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  public calculateTotal(): number {
    return this.productsInCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  public increaseQuantity(index: number, product: ProductInCartDto): void {
    this.productsInCart[index].quantity++;
    this.updateQuantitySubject.next({
      productId: product.productId,
      sizeId: product.sizeId,
      cartId: null,
      colorId: product.colorId,
      quantity: this.productsInCart[index].quantity + 1,
    });
  }

  public decreaseQuantity(index: number, product: ProductInCartDto): void {
    if (this.productsInCart[index].quantity > 1) {
      this.updateQuantitySubject.next({
        productId: product.productId,
        sizeId: product.sizeId,
        cartId: null,
        colorId: product.colorId,
        quantity: this.productsInCart[index].quantity - 1,
      });
      this.productsInCart[index].quantity--;
    }
  }

  public confirmDelete(event: Event, product: ProductInCartDto, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this product?',
      header: 'Delete Product',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
      },

      accept: () => {
        this.cartService.deleteProductInCart({
          productId: product.productId,
          cartId: null,
          sizeId: product.sizeId,
          colorId: product.colorId,
          quantity: 0
        }, this.commonService.userInfor.id).pipe(
          tap((res: ProductCartResponse) => {
            switch (res.status) {
              case EnumProductCart.Success:
                this.productsInCart.splice(index, 1);
                this.commonService.immediateSubject.next(true);
                this.toastService.success(`${res.message}`);
                break;
              default:
                this.toastService.fail(`${res.message}`);
                break;
            }
          }),
          catchError((error: HttpErrorResponse) => {
            switch (error.error.status) {
              case EnumProductCart.CartNotFound:
                this.toastService.fail(error.error.message);
                break;
              case EnumProductCart.ProductNotFound:
                this.toastService.fail(error.error.message);
                break;
              case EnumProductCart.NotEnoughInStock:
                this.toastService.fail(error.error.message);
                break;
              default:
                this.toastService.fail(error.error.message);
                break;
            }
            return EMPTY;
          })
        ).subscribe();
      },
      reject: () => {
        this.toastService.info("You canceled delete product!");
      },
  });
  }
}

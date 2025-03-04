import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LanguageSelect } from '../../dtos/languageSelect.dto';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { DomService } from '../../services/dom.service';
import { UserDto } from '../../dtos/user.dto';
import { tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ProductInCartDto } from '../../dtos/productInCart.dto';
import { CartService } from '../../services/cart.service';

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
    OverlayBadgeModule
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent implements OnInit {
  @ViewChild('settingIcon') settingIcon!: ElementRef;
  public languages!: LanguageSelect[];
  public selectedLanguage!: LanguageSelect;
  public isChecked!: boolean;
  public items!: MenuItem[];
  public badgeValue: number = 0;
  public profileItems: MenuItem[] | undefined;
  public productsInCart: ProductInCartDto[] = [];
  private theme!: string;

  public userInfor!: UserDto;

  constructor(
    private translate: TranslateService,
    private themeService: ThemeService,
    private domService: DomService,
    private router: Router,
    private cartService: CartService
  ) {
    if (typeof(localStorage) !==  'undefined') {
      const userInfor = localStorage.getItem("userInfor");
      this.userInfor = userInfor ? JSON.parse(userInfor) : {} as UserDto;
    }
    if (typeof sessionStorage !== 'undefined') {
      const themeFromStorage = sessionStorage.getItem("theme");
      this.theme = themeFromStorage || "light";
    }
  }

  ngOnInit(): void {
    this.cartService.getProductsInCart(this.userInfor.id).pipe(
      tap((productsInCart: ProductInCartDto[]) => {
        this.productsInCart = productsInCart;
        this.badgeValue = productsInCart.length;
      })
    ).subscribe();

    this.profileItems = [
      {
          label: 'Options',
          items: [
              {
                  label: 'Profile settings',
                  icon: 'pi pi-user'
              },
              {
                  label: 'Sign out',
                  icon: 'pi pi-sign-out',
                  command: () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userInfor");
                    this.router.navigateByUrl("/Login");
                  }
              }
          ]
      }
  ];


    this.themeService.themeIsChecked$.pipe(
      tap((value: boolean) => {
        this.isChecked = value;
      })
    ).subscribe()

    this.languages = [
      { name: 'Việt Nam', code: 'vn' },
      { name: 'English', code: 'en' },
    ];

    this.selectedLanguage = this.languages[1];
    if (this.userInfor) {
      if (this.userInfor.theme == "dark") {
        this.themeService.themeIsCheckedSubject.next(false);
      } else if (this.userInfor.theme == "light") {
        this.themeService.themeIsCheckedSubject.next(true);
      }
    } else {
      if (this.theme == "dark") {
        this.themeService.themeIsCheckedSubject.next(false);
      } else if (this.theme == "light") {
        this.themeService.themeIsCheckedSubject.next(true);
      }
    }

    this.initMenu();
    
  }

  private initMenu() {
    this.translate.get('header.settingLabel').subscribe((settingLabel) => {
      this.items = [
        {
          label: settingLabel
        }
      ]
    })
  }

  public changeLanguage(languageCode: string) {
    console.log(languageCode);
    this.translate.use(languageCode);
    localStorage.setItem('language', languageCode);
    this.initMenu();
  }

  public changeTheme() {
    if (this.domService.containElement("my-app-dark")) {
      this.themeService.toggleTheme("light").subscribe();
      sessionStorage.setItem("theme", "light");
    } else {
      this.themeService.toggleTheme("dark").subscribe();
      sessionStorage.setItem("theme", "dark");
    }
  }

  public addSpin() {
    this.settingIcon.nativeElement.classList.add("pi-spin");
  }

  public removeSpin() {
    this.settingIcon.nativeElement.classList.remove("pi-spin");
  }

}

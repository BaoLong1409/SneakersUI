import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserDto } from './core/dtos/user.dto';
import { DomService } from './core/services/dom.service';
import { ThemeService } from './core/services/theme.service';
import { Observable, of, switchMap, tap } from 'rxjs';
import { LoadingService } from './core/services/loading.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SneakersUi';
  private userInfor!: UserDto;
  private theme!: string;
  public loading$!: Observable<boolean>;

  constructor(
    private translate: TranslateService,
    private domService: DomService,
    private themeService: ThemeService,
    private loadingService: LoadingService
  ) {
    this.loading$ = this.loadingService.loading$;
    this.loadingService.loadingSubject.next(true);
    this.translate.setDefaultLang('en');
    if (typeof(localStorage) != 'undefined') {
      const userSneakersInfor = localStorage.getItem("userSneakersInfor");
      this.userInfor = userSneakersInfor ? JSON.parse(userSneakersInfor) : {} as UserDto;
      let localLang = 'en';
      if (this.userInfor) {
        localLang = this.userInfor.languageCode || 'en';
      } else {
        localLang = localStorage.getItem('language') || this.translate.getBrowserLang()?.match('/en|vn/')?.[0] || 'en' ;
      }
      
      this.translate.use(localLang);
      localStorage.setItem('language', localLang);
    }

    
    if (typeof sessionStorage !== 'undefined') {
      const themeFromStorage = sessionStorage.getItem("theme");
      this.theme = themeFromStorage || "light";
    }
    
  }

  ngOnInit(): void {
    this.checkTheme();

    this.themeService.themeIsChecked$.pipe(
      tap((isChecked: boolean) => {
        if (isChecked == true) {
          this.domService.removeClassToHtml("my-app-dark");
        } else {
          this.domService.addClassToHtml("my-app-dark");
        }
      }),
      switchMap(() => {
        this.loadingService.loadingSubject.next(false);
        return of();
      })
    )
    .subscribe()
  }

  private checkTheme() {
    if (this.userInfor && Object.keys(this.userInfor).length !== 0 && this.userInfor.theme == "light") {
      sessionStorage.setItem("theme", "light");
      this.themeService.themeIsCheckedSubject.next(true);
    } else if (this.userInfor && Object.keys(this.userInfor).length !== 0 && this.userInfor.theme == "dark") {
      sessionStorage.setItem("theme", "dark");
      this.domService.addClassToHtml("my-app-dark")
      this.themeService.themeIsCheckedSubject.next(false);
    } else if (this.userInfor && Object.keys(this.userInfor).length === 0 && this.theme == "light") {
      sessionStorage.setItem("theme", "light");
      this.themeService.themeIsCheckedSubject.next(true);
    } else if (this.userInfor && Object.keys(this.userInfor).length === 0 && this.theme == "dark") {
      sessionStorage.setItem("theme", "dark");
      this.domService.addClassToHtml("my-app-dark");
      this.themeService.themeIsCheckedSubject.next(false);
    }

  }

}

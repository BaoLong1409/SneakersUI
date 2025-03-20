import { AfterViewInit, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../../../core/commonComponent/base.component';
import { ToastService } from '../../../../core/services/toast.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { catchError, delay, EMPTY, filter, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { BlockUIModule } from 'primeng/blockui';
import { UserService } from '../../../../core/services/user.service';
import { loginDetailDto } from '../../../../core/dtos/loginDetail.dto';
import { UserDto } from '../../../../core/dtos/user.dto';
import { Select } from 'primeng/select';
import { LanguageSelect } from '../../../../core/dtos/languageSelect.dto';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppHeaderComponent } from '../../../../core/components/app-header/app-header.component';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    ToastModule,
    BlockUIModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    FormsModule,
    TranslateModule,
    AppHeaderComponent,
  ],
  providers: [
    MessageService,
    ToastService
  ]
  ,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent extends BaseComponent implements AfterViewInit {

  public formSubmitSubject = new Subject<void>();
  public formSubmit$ = this.formSubmitSubject.asObservable();
  public loginForm: FormGroup
  public blockedUi: boolean = false;
  private token!: string;
  public languages!: LanguageSelect[];

  public selectedLanguage!: LanguageSelect;

  constructor(
    private readonly messageService: MessageService,
    private toastService: ToastService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone
  ) {
    super();
    this.loginForm = this.fb.group({
      email: [, Validators.required],
      password: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    (window as any).handleCredentialResponse = (response: any) => {
      this.ngZone.run(() => {
        console.log("Google Token:", response.credential);

        this.userService.googleLogin(response.credential).pipe(
          tap((loginVal: loginDetailDto) => {
            this.toastService.success(loginVal.message);
            localStorage.setItem("token",loginVal.token);
            this.token = loginVal.token;
            this.blockUi();
          }),
          switchMap(() => {
            return this.userService.getInforUser(this.token).pipe(
              tap((userInfor: UserDto) => {
                userInfor.id = userInfor.id.toUpperCase(); // Tạm thời
                
                localStorage.setItem("userInfor", JSON.stringify(userInfor));
              })
            );
          }),
          tap(() => {
            window.location.href = '/Home';
          }),
          catchError((error) => {
            this.toastService.fail(error.error.message);
            return of();
          }),
          takeUntil(this.destroyed$)
        ).subscribe();
      });
    };

    this.formSubmit$.pipe(
      filter(() => {
        if (this.loginForm.invalid) {
          this.toastService.fail("Vui lòng kiểm tra lại thông tin");
          return false;
        }
        return true;
      }),
      switchMap(() => {
        return this.userService.login({
          email : this.loginForm.value.email,
          password : this.loginForm.value.password,
        }).pipe(
          tap((loginVal : loginDetailDto) => {
            this.toastService.success(loginVal.message);
            localStorage.setItem("token",loginVal.token);
            this.token = loginVal.token;
            this.blockUi();
          }),
          delay(1000),
          switchMap(() => {
            return this.userService.getInforUser(this.token).pipe(
              tap((userInfor: UserDto) => {
                userInfor.id = userInfor.id.toUpperCase(); // Tạm thời
                
                localStorage.setItem("userInfor", JSON.stringify(userInfor));
              })
            );
          }),
          tap(() => {
            window.location.href = '/Home';
          }),
          catchError((error) => {
            this.toastService.fail(error.error.message);
            return of();
          })
        )
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  blockUi() {
    this.blockedUi = true;
    setTimeout(() => {
        this.blockedUi = false;
    }, 1000);
  }

}

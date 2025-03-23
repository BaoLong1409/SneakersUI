import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../../core/services/user.service';
import { catchError, debounceTime, delay, EMPTY, takeUntil, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseMessageDto } from '../../../core/dtos/responseMessage.dto';
import { MessageAndSessionTokenRes } from '../../../core/dtos/Response/messageAndSessionTokenRes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [
    ButtonModule,
    StepperModule,
    InputTextModule,
    FloatLabel,
    InputOtpModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers: [
    MessageService,
    ToastService
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ForgetPasswordComponent extends BaseComponent {
  public emailInput!: string;
  public otpInput!: string;
  public emailInvalid: boolean = false;
  constructor(
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) {
    super();
  }

  public goToSecondStep(step: number, activateCallback: (value: number) => void) {
    this.userService.getOTP(this.emailInput).pipe(
      tap((res: ResponseMessageDto) => {
        this.toastService.success(res.message);
        activateCallback(step);
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastService.fail(error.error.message);
        return EMPTY;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public goToFirstStep(step: number, activateCallback: (value: number) => void) {
    if (activateCallback) {
      activateCallback(step);
    }
  }

  public submitForgetPass() {
    if (this.emailInput && this.otpInput) {
      this.userService.validateOTP({email: this.emailInput, otp: this.otpInput}).pipe(
        tap((res: MessageAndSessionTokenRes) => {
          const expiresAt = Date.now() + 180 * 1000;
          const token = res.sessionToken;
          sessionStorage.setItem("sessionToken", JSON.stringify({ token , expiresAt }));
        }),
        delay(2000),
        tap(() => {
          window.location.href = "/Password/Change"
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.fail(err.error.message);
          return EMPTY;
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
    } else {
      this.toastService.info("Please fill in email and otp input!")
    }

  }
}

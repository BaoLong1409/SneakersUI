import { AfterViewInit, Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../core/services/toast.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { catchError, debounceTime, delay, EMPTY, takeUntil, tap } from 'rxjs';
import { ResponseMessageDto } from '../../../core/dtos/responseMessage.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../../core/services/common.service';

@Component({
  selector: 'app-change-password',
  imports: [
    PasswordModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService,
    ToastService
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent extends BaseComponent implements AfterViewInit {
  public passwordChangeForm: FormGroup;
  public resetPasswordForm: FormGroup;
  public sessionToken!: string | null;

  constructor(
    private toastService: ToastService,
    private userService: UserService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {
    super();
    this.passwordChangeForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    })

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
    })

    this.sessionToken = this.commonService.sessionToken;
  }

  ngAfterViewInit(): void {
    
  }

  public submitChangePassword() {
    if (!this.passwordChangeForm.valid) {
      this.toastService.info("Please fill in two password forms")
    } else {
      this.userService.changePassword(this.passwordChangeForm.value).pipe(
        tap((res: ResponseMessageDto) => {
          this.toastService.success(res.message);
          this.passwordChangeForm.reset();
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.fail(err.error.message);
          return EMPTY;
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
    }
  }

  public submitResetPassword() {
    if (!this.resetPasswordForm.valid) {
      this.toastService.info("Please fill in new password")
    } else {
      this.userService.resetPassword(this.resetPasswordForm.value.newPassword).pipe(
        tap((res: ResponseMessageDto) => {
          this.toastService.success(res.message);
          this.resetPasswordForm.reset();
        }),
        delay(2000),
        tap(() => {
          window.location.href = "/Login"
        }),
        catchError((err: HttpErrorResponse) => {
          this.toastService.fail(err.error.message);
          return EMPTY;
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
    }
  }
}

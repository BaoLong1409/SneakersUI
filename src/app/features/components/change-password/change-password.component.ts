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
import { catchError, EMPTY, takeUntil, tap } from 'rxjs';
import { ResponseMessageDto } from '../../../core/dtos/responseMessage.dto';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(
    private toastService: ToastService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    super();
    this.passwordChangeForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    })
  }

  ngAfterViewInit(): void {
    
  }

  public submitChangePassword() {
    console.log(this.passwordChangeForm.valid);
    
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
}

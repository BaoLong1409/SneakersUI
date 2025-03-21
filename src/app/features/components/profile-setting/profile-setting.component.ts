import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { ShippingService } from '../../../core/services/shipping.service';
import { BehaviorSubject, catchError, EMPTY, takeUntil, tap } from 'rxjs';
import { ShippingInfoDto } from '../../../core/dtos/shippingInfo.dto';
import { CommonService } from '../../../core/services/common.service';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { ShippingInfoRes } from '../../../core/dtos/Response/shippingInfoRes';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserDto } from '../../../core/dtos/user.dto';
import { FloatLabel } from 'primeng/floatlabel';
import { UserService } from '../../../core/services/user.service';
import { ResponseMessageDto } from '../../../core/dtos/responseMessage.dto';
import { MessageAndDataRes } from '../../../core/dtos/Response/messageAndDataRes';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile-setting',
  imports: [
    CardModule,
    AsyncPipe,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    FloatLabel
  ],
  providers: [
    MessageService,
    ToastService,
    ConfirmationService
  ],
  templateUrl: './profile-setting.component.html',
  styleUrl: './profile-setting.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileSettingComponent extends BaseComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public visible: boolean = false;
  public shippingInfoListSubject = new BehaviorSubject<ShippingInfoDto[]>([]);
  public shippingInfoList$ = this.shippingInfoListSubject.asObservable();
  public userInfo!: UserDto;

  public shippingInfoForm: FormGroup;
  public userInfoForm: FormGroup;
  constructor(
    private readonly shippingService: ShippingService,
    private readonly commonService: CommonService,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: Object, private renderer: Renderer2,
    private readonly fb: FormBuilder
  ) {
    super();
    this.shippingInfoForm = this.fb.group({
      id: [null],
      fullName: [, Validators.required],
      email: [],
      phoneNumber: [, Validators.required],
      address: [, Validators.required],
      userId: [this.commonService.userInfor.id, Validators.required],
      note: [],
      isMainAddress: [false, Validators.required]
    })

    this.userInfo = this.commonService.userInfor;

    this.userInfoForm = this.fb.group({
      id: [this.userInfo.id],
      firstName: [this.userInfo.firstName, Validators.required],
      lastName: [this.userInfo.lastName, Validators.required],
      phoneNumber: [this.userInfo.phoneNumber],
      avatarFile: [null],
      avatarName: [null]
    })
  }

  ngOnInit(): void {
    this.shippingService.getAllUserAddresses(this.commonService.userInfor.id).pipe(
      tap((userAddresses: ShippingInfoDto[]) => {
        this.shippingInfoListSubject.next(userAddresses);
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public showAddAddress() {
    if (isPlatformBrowser(this.platformId)) {
      this.visible = true;
    }
  }

  public addAndUpdateAddress() {
      this.shippingInfoForm.patchValue({
        isMainAddress: this.shippingInfoForm.value.isMainAddress === false ? 0 : 1
      });
    
    if (this.shippingInfoForm.valid && this.shippingInfoForm.value.id == null) {
      this.shippingService.addShippingAddress(this.shippingInfoForm.value).pipe(
        tap((res: ShippingInfoRes) => {
          this.shippingInfoListSubject.next(res.data);
          this.shippingInfoForm.reset();
          this.toastService.success(res.message);
          this.visible = false;
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
    } else if (this.shippingInfoForm.valid && this.shippingInfoForm.value.id) {
      this.shippingService.updateShippingAddress(this.shippingInfoForm.value).pipe(
        tap((res: ShippingInfoRes) => {
          this.shippingInfoListSubject.next(res.data);
          this.shippingInfoForm.reset();
          this.toastService.success(res.message);
          this.visible = false;
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
    }
  }

  public openUpdateDialog(shippingInfo: ShippingInfoDto): void {
    this.visible = true;
    this.shippingInfoForm.patchValue({
      id: shippingInfo.id,
      fullName: shippingInfo.fullName,
      email: shippingInfo.email,
      phoneNumber: shippingInfo.phoneNumber,
      address: shippingInfo.address,
      userId: shippingInfo.userId,
      note: shippingInfo.note,
      isMainAddress: shippingInfo.isMainAddress == 0 ? false : true
    })
  }

  confirmDelete(event: Event, shippingInfoId: string | null) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this address?',
        header: 'Warning!',
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
            if (this.shippingInfoForm != null) {
              this.shippingService.deleteShippingAddress(shippingInfoId).pipe(
                tap((res: ShippingInfoRes) => {
                  this.shippingInfoListSubject.next(res.data);
                  this.shippingInfoForm.reset();
                  this.toastService.success(res.message);
                  this.visible = false;
                }),
                takeUntil(this.destroyed$)
              ).subscribe();
            }
        },
        reject: () => {
            this.toastService.info('You have rejected');
        },
    });
  }

  public changeAvatar() {
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userInfoForm.patchValue({
          avatarFile: e.target?.result as string,
          avatarName: file.name
        })
        this.userInfo.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  public updateUserInfo() {
    this.userService.updateUserInfo(this.userInfoForm.value).pipe(
      tap((res: MessageAndDataRes<UserDto>) => {
        this.toastService.success(res.message);
        this.commonService.setUserInfo(res.data as UserDto);
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.fail(err.error.errors.PhoneNumber);
        return EMPTY;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }
}

import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BaseComponent } from '../../../core/commonComponent/base.component';
import { ReviewService } from '../../../core/services/review.service';
import { BehaviorSubject, catchError, delay, EMPTY, takeUntil, tap } from 'rxjs';
import { ProductsAreWaitingReviewDto } from '../../../core/dtos/productsAreWaitingReview.dto';
import { AsyncPipe } from '@angular/common';
import { CommonService } from '../../../core/services/common.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { RatingModule } from 'primeng/rating';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ResponseMessageDto } from '../../../core/dtos/responseMessage.dto';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-review',
  imports: [
    CardModule,
    AsyncPipe,
    ButtonModule,
    DialogModule,
    TextareaModule,
    IftaLabelModule,
    RatingModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [ToastService, MessageService],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent extends BaseComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  public productsWaitingReviewSubject = new BehaviorSubject<
    ProductsAreWaitingReviewDto[]
  >([]);
  public productsWaitingReview$ =
    this.productsWaitingReviewSubject.asObservable();

  public dialogVisible: boolean = false;
  public orderDetailSelectedId!: string;
  public imageFiles: { file: File; url: string }[] = [];
  public reviewForm: FormGroup;
  

  constructor(
    private readonly reviewService: ReviewService,
    private readonly commonService: CommonService,
    private readonly toastService: ToastService,
    private readonly fb: FormBuilder
  ) {
    super();
    this.reviewForm = this.fb.group({
      commentContent: [],
      quality: [, Validators.required],
      image: [],
      userId: [, Validators.required],
      orderDetailId: [, Validators.required],
    });
  }

  ngOnInit(): void {
    this.reviewService
      .getProductsAreWaitingReview(this.commonService.userInfor.id)
      .pipe(
        tap((products: ProductsAreWaitingReviewDto[]) => {
          this.productsWaitingReviewSubject.next(products);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public onFileSelect(event: any) {
    const files = event.target.files;
    if (!files) return;

    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageFiles = [...this.imageFiles, { file, url: e.target.result }];
      };
      reader.readAsDataURL(file);
    }
    this.fileInput.nativeElement.value = '';
  }

  public removeImage(image: { file: File; url: string }) {
    this.imageFiles = this.imageFiles.filter((img) => img !== image);
  }

  public reviewProduct() {
    this.reviewForm.patchValue({
      image: this.imageFiles.map(file => ({
        fileName: file.file.name,
        base64Data: file.url
      })),
      userId: this.commonService.userInfor.id,
      orderDetailId: this.orderDetailSelectedId,
    });

    this.reviewService.reviewProduct(this.reviewForm.value).pipe(
      tap((res: ResponseMessageDto) => {
        this.toastService.success(res.message);
      }),
      delay(1000),
      tap(() => this.dialogVisible = false),
      catchError((res: HttpErrorResponse) => {
        this.toastService.fail(res.error.message);
        return EMPTY;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }
}

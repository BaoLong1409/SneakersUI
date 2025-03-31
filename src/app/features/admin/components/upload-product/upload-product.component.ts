import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { CategoryService } from '../../../../core/services/category.service';
import { BaseComponent } from '../../../../core/commonComponent/base.component';
import { BehaviorSubject, catchError, delay, EMPTY, finalize, takeUntil, tap } from 'rxjs';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { ColorService } from '../../../../core/services/color.service';
import { ColorDto } from '../../../../core/dtos/color.dto';
import { SizeService } from '../../../../core/services/size.service';
import { SizeDto } from '../../../../core/dtos/size.dto';
import { TableModule } from 'primeng/table';
import { UploadSizeRequest } from '../../../../core/dtos/Request/uploadSizeReq';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ResponseMessageDto } from '../../../../core/dtos/responseMessage.dto';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedModule } from '../../../../core/commonComponent/SharedModule/SharedModule';

@Component({
  selector: 'app-upload-product',
  imports: [
    SharedModule,
  ],
  providers:[
    ToastService,
  ],
  templateUrl: './upload-product.component.html',
  styleUrl: './upload-product.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UploadProductComponent extends BaseComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  public imageFiles: any[] = [];
  public filterCategories: string[] = [];
  public filterBrands: string[] = [];
  public filterColors: {id: string, colorName: string}[] = [];
  public uploadSizeRequest: UploadSizeRequest[] = [];
  public loading: boolean = false;

  private categoryOptions: string[] = [];
  private brandOptions: string[] = [];
  private colorOptions: {id: string, colorName: string}[] = [];

  public uploadNewProductForm: FormGroup;


  constructor(
    private readonly categoryService: CategoryService,
    private readonly colorService: ColorService,
    private readonly productService: ProductService,
    private readonly toastService: ToastService,
    private readonly sizeService: SizeService,
    private readonly fb: FormBuilder
  ) {
    super();
    this.uploadNewProductForm = this.fb.group({
      productName: [,Validators.required],
      productDescription: [],
      sale: [0],
      price: [,Validators.required],
      color: [, Validators.required],
      categoryName: [, Validators.required],
      brand: [, Validators.required],
      productImages: [, Validators.required],
      ordinalImageThumbnail: [0, Validators.required],
      sizesQuantity: [, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService
      .getAllCategories()
      .pipe(
        tap((categories: CategoryDto[]) => {
          this.categoryOptions = [...new Set(categories.map((c) => c.categoryName))];
          this.filterCategories = this.categoryOptions;
          this.brandOptions = [...new Set(categories.map((c) => c.brand))];
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

      this.colorService.getAllColos().pipe(
        tap((colors: ColorDto[]) => {
          this.colorOptions = Array.from(
            new Map(colors.map(c => [c.id, c])).values()
          );
        }),
        takeUntil(this.destroyed$)
      ).subscribe();

      this.sizeService.getAllSizes().pipe(
        tap((sizes: SizeDto[]) => {
          this.uploadSizeRequest = sizes.map(size => ({...size, quantity: 0}));
        }),
        takeUntil(this.destroyed$)
      ).subscribe();
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

  public changeThumbnailImg(ordinal: number) {
    this.uploadNewProductForm.patchValue({
      ordinalImageThumbnail: ordinal
    });
  }

  public uploadProduct() {
    this.loading = true;
    this.uploadNewProductForm.patchValue({
      productImages: this.imageFiles.map(file => ({
        fileName: file.file.name,
        base64Data: file.url
      })),
      sizesQuantity: this.uploadSizeRequest.filter(size => size.quantity !== 0)
    });

    this.productService.uploadNewProduct(this.uploadNewProductForm.value).pipe(
      tap((res: ResponseMessageDto) => {
        this.toastService.success(res.message);
      }),
      delay(500),
      tap(() => {
        this.uploadNewProductForm.reset();
        this.imageFiles = [];
        this.uploadSizeRequest = [];
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.fail(err.error.message);
        return EMPTY;
      }),
      finalize(() => this.loading = false),
      takeUntil(this.destroyed$)
    ).subscribe();
    
  }

  public searchCategories(event: AutoCompleteCompleteEvent) {
    this.filterCategories = this.categoryOptions.filter((item) =>
      item.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  public searchBrands(event: AutoCompleteCompleteEvent) {
    this.filterBrands = this.brandOptions.filter((item) =>
      item.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  public searchColors(event: AutoCompleteCompleteEvent) {
    this.filterColors = this.colorOptions.filter((item) =>
      item.colorName.toLowerCase().includes(event.query.toLowerCase())
    );
  }
}

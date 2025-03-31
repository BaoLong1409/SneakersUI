import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../core/commonComponent/base.component';
import { SharedModule } from '../../../../core/commonComponent/SharedModule/SharedModule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadSizeRequest } from '../../../../core/dtos/Request/uploadSizeReq';
import { CategoryService } from '../../../../core/services/category.service';
import { ColorService } from '../../../../core/services/color.service';
import { ProductService } from '../../../../core/services/product.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SizeService } from '../../../../core/services/size.service';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { catchError, EMPTY, forkJoin, Observable, of, switchMap, takeUntil, tap } from 'rxjs';
import { ColorDto } from '../../../../core/dtos/color.dto';
import { SizeDto } from '../../../../core/dtos/size.dto';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailProductDto } from '../../../../core/dtos/detailProduct.dto';
import { ImageUploadDto } from '../../../../core/dtos/imageUpload.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseMessageDto } from '../../../../core/dtos/responseMessage.dto';
import { ConfirmationService, MenuItem } from 'primeng/api';


@Component({
  selector: 'app-update-product',
  imports: [SharedModule],
  providers: [ToastService, ConfirmationService],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent extends BaseComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  public imageFiles: any[] = [];
  public filterCategories: string[] = [];
  public filterBrands: string[] = [];
  public filterColors: { id: string; colorName: string }[] = [];
  public updateSizeRequest: UploadSizeRequest[] = [];
  public detailProduct!: DetailProductDto;
  public loading: boolean = false;

  private categoryOptions: string[] = [];
  private brandOptions: string[] = [];
  private colorOptions: { id: string; colorName: string }[] = [];
  private productId!: string;
  private productColor!: string;

  public updateProductForm: FormGroup;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: Router,
    private readonly colorService: ColorService,
    private readonly productService: ProductService,
    private readonly toastService: ToastService,
    private readonly sizeService: SizeService,
    private confirmationService: ConfirmationService,
    private readonly fb: FormBuilder
  ) {
    super();
    this.updateProductForm = this.fb.group({
      productId: [,Validators.required],
      productName: [,Validators.required],
      productDescription: [,Validators.required],
      sale: [0],
      price: [,Validators.required],
      color: [,Validators.required],
      categoryName: [, Validators.required],
      brand: [, Validators.required],
      productImages: [, Validators.required],
      ordinalImageThumbnail: [0, Validators.required],
      sizesQuantity: [, Validators.required],
    });

    this.productId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.productColor =
      this.activatedRoute.snapshot.paramMap.get('colorName') ?? '';
  }

  ngOnInit(): void {
    this.productService
      .getDetailProduct(this.productId, this.productColor)
      .pipe(
        tap((detailProduct: DetailProductDto) => {       
          this.updateProductForm.patchValue({
            productId: this.productId,
            productName: detailProduct.productName,
            sale: detailProduct.sale,
            price: detailProduct.price,
            color: {id: detailProduct.colorId, colorName: detailProduct.colorName},
            categoryName: [...detailProduct.categories.map(c => c.categoryName)],
            brand: detailProduct.categories[0].brand,
            ordinalImageThumbnail: detailProduct.productImages.findIndex(i => i.isThumbnail == 1),
          });
        }),
        switchMap((detailProduct: DetailProductDto) => {
          const imageObservables = detailProduct.productImages.map((image) => 
            this.convertImageToBase64(image.imageUrl)
          )

          return forkJoin(imageObservables).pipe(
            tap((data) => {
              this.updateProductForm.patchValue({
                productImages: data.map(imageData => ({
                  base64Data: imageData.base64Data,
                  fileName: imageData.fileName
                }))
              })
            })
          );
        }),
        tap(() => {
          console.log(this.updateProductForm.value);
          
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.categoryService
      .getAllCategories()
      .pipe(
        tap((categories: CategoryDto[]) => {
          this.categoryOptions = [
            ...new Set(categories.map((c) => c.categoryName)),
          ];
          this.filterCategories = this.categoryOptions;
          this.brandOptions = [...new Set(categories.map((c) => c.brand))];
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.colorService
      .getAllColos()
      .pipe(
        tap((colors: ColorDto[]) => {
          this.colorOptions = Array.from(
            new Map(colors.map((c) => [c.id, c])).values()
          );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();

    this.sizeService
      .getAvailableSizes(this.productId, this.productColor)
      .pipe(
        tap((sizes: UploadSizeRequest[]) => {
          this.updateSizeRequest = sizes;
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

  public removeImage(image: ImageUploadDto) {
    this.updateProductForm.patchValue({
      productImages: this.updateProductForm.value.productImages.filter((img: ImageUploadDto) => img !== image)
    });
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

  public updateProduct() {
    this.updateProductForm.patchValue({
      productImages: [...this.updateProductForm.value.productImages, ...this.imageFiles.map(file => ({
        fileName: file.file.name,
        base64Data: file.url
      }))],
      sizesQuantity: this.updateSizeRequest.filter(size => size.quantity !== 0)
    });

    this.productService.updateProduct(this.updateProductForm.value).pipe(
      tap((res: ResponseMessageDto) => {
        this.toastService.success(res.message);
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.fail(err.error.message);
        return EMPTY;
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  public confirmDeleteDialog(event: Event) {
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
        this.productService.deleteProduct(this.productId).pipe(
          tap((res: ResponseMessageDto) => {
            this.toastService.success(res.message);
            this.route.navigateByUrl("/All");
          }),
          catchError((err: HttpErrorResponse) => {
            this.toastService.fail(err.error.message);
            return EMPTY;
          }),
          takeUntil(this.destroyed$)
        ).subscribe();
      },
      reject: () => {
        this.toastService.info('You canceled delete product!');
      },
    });
  }

  public changeThumbnailImg(ordinal: number) {
    this.updateProductForm.patchValue({
      ordinalImageThumbnail: ordinal
    });
  }

  private convertImageToBase64(imageUrl: string): Observable<{fileName: string, base64Data: string}> {
    const fileName = this.getNameFromImageUrl(imageUrl);
    return new Observable(observer => {
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            observer.next({
              base64Data: reader.result as string,
              fileName: fileName
            });
            observer.complete();
          };
          reader.onerror = error => observer.error(error);
          reader.readAsDataURL(blob);
        })
        .catch(error => observer.error(error));
    });
  }

  private getNameFromImageUrl(url: string): string {
    const segments = url.split('/');
    const fileNameWithExt = segments.pop() || '';
    return fileNameWithExt.split(".")[0];
  }
}

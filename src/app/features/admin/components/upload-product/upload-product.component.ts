import { Component, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { BaseComponent } from 'primeng/basecomponent';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { UploadEventInterface } from '../../../../core/commonComponent/interfaces/UploadEvent.interface';

@Component({
  selector: 'app-upload-product',
  imports: [
    InputTextModule,
    FileUploadModule,
    FloatLabel,
    TextareaModule,
    InputNumberModule
  ],
  templateUrl: './upload-product.component.html',
  styleUrl: './upload-product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UploadProductComponent extends BaseComponent{
  public imageFiles: any[] = [];

  constructor() {
    super();
  }

  public uploadFile(event: UploadEventInterface) {
    for (let image of event.files) {
      this.imageFiles.push(image);
    }
  }
}

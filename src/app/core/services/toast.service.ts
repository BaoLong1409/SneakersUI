import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private messageService: MessageService
  ) { }

  success(content: string) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: content})
  }

  fail(content : string){
    this.messageService.add({ severity: 'error', summary: 'Fail', detail: content});
  }

  info(content: string) {
    this.messageService.add({ severity: 'info', summary: 'Infomation', detail: content});
  }
}

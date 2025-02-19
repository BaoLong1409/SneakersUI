import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  constructor() { }

  public loadingOn() {
    this.loadingSubject.next(true);
  }

  public loadingOff() {
    this.loadingSubject.next(false);
  }
}

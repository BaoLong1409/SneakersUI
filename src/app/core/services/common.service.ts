import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserDto } from '../dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public userInfor!: UserDto;

  public immediateSubject = new BehaviorSubject<Boolean>(false);
  public stateImmediate$ = this.immediateSubject.asObservable();
  constructor() {
    if (typeof(localStorage) !==  'undefined') {
      const userInfor = localStorage.getItem("userInfor");
      this.userInfor = userInfor ? JSON.parse(userInfor) : {} as UserDto;
    }
  }
}

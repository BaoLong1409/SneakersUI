import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserDto } from '../dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public userInfor!: UserDto;
  public token!: string | null;
  public sessionToken!: string | null;

  public immediateSubject = new BehaviorSubject<Boolean>(false);
  public stateImmediate$ = this.immediateSubject.asObservable();
  constructor() {
    if (typeof(localStorage) !==  'undefined') {
      const userInfor = localStorage.getItem("userInfor");
      this.userInfor = userInfor ? JSON.parse(userInfor) : {} as UserDto;
      const item = localStorage.getItem("token");
      this.token = item ? item : null;
    }

    if (typeof (sessionStorage)) {
      const item = sessionStorage.getItem("sessionToken");
      if (item) {
        const {token, expiresAt} = (item ? JSON.parse(item) : null);
        if (Date.now() <= expiresAt) {
          this.sessionToken = token;
        }
      }
    }
  }

  public setUserInfo(userInfo: UserDto) {
    localStorage.setItem("userInfor", JSON.stringify(userInfo));
  }
}

import { Injectable, OnInit } from '@angular/core';
import { UserDto } from '../dtos/user.dto';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private userInfor!: UserDto;
  private token!: string | null;
  private readonly apiUrl: string = environment.apiUrl;
  public themeIsCheckedSubject = new BehaviorSubject<boolean>(true);
  public themeIsChecked$ = this.themeIsCheckedSubject.asObservable();
  constructor(
    private readonly httpClient: HttpClient
  ) {
    if (typeof(localStorage) !==  'undefined') {
      const userInfor = localStorage.getItem("userSneakersInfor");
      this.userInfor = userInfor ? JSON.parse(userInfor) : {} as UserDto;
      this.token = localStorage.getItem("token");
    }
  }

  public toggleTheme(theme: string) {
    if (theme == "dark") {
      this.themeIsCheckedSubject.next(false);
    } else {
      this.themeIsCheckedSubject.next(true);
    }
    const header = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
    return this.httpClient.put(`${this.apiUrl}user/changeTheme`, {
      headers: header,
      theme
    });
  }

}

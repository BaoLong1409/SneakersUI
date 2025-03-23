import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { registerReq } from '../requestTypes/registerReq';
import { loginReq } from '../requestTypes/loginReq';
import { loginDetailDto } from '../dtos/loginDetail.dto';
import { UserDto } from '../dtos/user.dto';
import { ResponseMessageDto } from '../dtos/responseMessage.dto';
import { UpdateUserInfoRequest } from '../dtos/Request/updateUserReq';
import { MessageAndDataRes } from '../dtos/Response/messageAndDataRes';
import { ChangePasswordRequest } from '../dtos/Request/changePasswordReq';
import { ValidateOTPRequest } from '../dtos/Request/validateOTPReq';
import { MessageAndSessionTokenRes } from '../dtos/Response/messageAndSessionTokenRes';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly token!: string | null; 
  private readonly sessionToken!: string | null; 
  private readonly apiUrl: string = environment.apiUrl
  constructor(
    private readonly httpClient: HttpClient,
    private readonly commonService: CommonService
  ) {
    if (typeof(localStorage) !==  'undefined') {
      this.token = localStorage.getItem("token");
    }
    this.sessionToken = this.commonService.sessionToken;
  }

  public register(registerInfor: registerReq){
    return this.httpClient.post(`${this.apiUrl}user/register`, registerInfor);
  }

  public login(loginInfor: loginReq) {
    return this.httpClient.post<loginDetailDto>(`${this.apiUrl}user/login`, loginInfor);
  }

  public googleLogin(googleToken: string) {
    return this.httpClient.post<loginDetailDto>(`${this.apiUrl}user/googleLogin`, {googleToken});
  }

  public changePassword(passwordValues: ChangePasswordRequest) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })

    return this.httpClient.post<ResponseMessageDto>(`${this.apiUrl}user/changePassword`, passwordValues, {
      headers: headers,
    });
  }

  public resetPassword(newPassword: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.sessionToken}`
    })

    return this.httpClient.post<ResponseMessageDto>(`${this.apiUrl}user/resetPassword`, {newPassword}, {
      headers: headers,
    });
  }

  public getOTP(email: string) {
    return this.httpClient.get<ResponseMessageDto>(`${this.apiUrl}user/forgetPassword/getOTP`, {params: {email}});
  }

  public validateOTP(validateOtpReq: ValidateOTPRequest) {
    return this.httpClient.post<MessageAndSessionTokenRes>(`${this.apiUrl}user/forgetPassword/validateOTP`, validateOtpReq);
  }

  public getInforUser(token: string){
    return this.httpClient.get<UserDto>(`${this.apiUrl}user/getInfor`,{ params: { token }});
  }

  public getUserByName(name: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const param = {searchContent: name};

    return this.httpClient.get<UserDto[]>(`${this.apiUrl}user/find`, {
      headers: headers, 
      params: param
    });
  }

  public getUserById(id: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    const param = {id: id};

    return this.httpClient.get<UserDto>(`${this.apiUrl}user/findById`, {
      headers: headers, 
      params: param
    });
  }

  public sendConfirmationLink(email: string) {
    return this.httpClient.get<ResponseMessageDto>(`${this.apiUrl}user/sendConfirmLink`, { params: { email }});
  }

  public updateUserInfo (userInfo: UpdateUserInfoRequest) {
    return this.httpClient.put<MessageAndDataRes<UserDto>>(`${this.apiUrl}user/updateInfo`, userInfo);
  }
}

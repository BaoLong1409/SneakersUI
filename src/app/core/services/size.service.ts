import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { SizeDto } from '../dtos/size.dto';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
  private readonly apiUrl: string = environment.apiUrl
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public getAllSizes() {
    return this.httpClient.get<SizeDto[]>(`${this.apiUrl}size/getAllSizes`);
  }
}

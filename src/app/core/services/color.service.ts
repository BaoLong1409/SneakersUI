import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { ColorDto } from '../dtos/color.dto';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private readonly apiUrl: string = environment.apiUrl
  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public getAllColos() {
    return this.httpClient.get<ColorDto[]>(`${this.apiUrl}color/getAll`);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { CategoryDto } from '../dtos/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl: string = environment.apiUrl

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  public getAllCategories() {
      return this.httpClient.get<CategoryDto[]>(`${this.apiUrl}category/getAll`);
    }
}

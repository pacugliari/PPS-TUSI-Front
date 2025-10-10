import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { LoginResponse } from './register.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public login(body: {
    email: string;
    password: string;
  }): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<any>(environment.API_URL + 'auth/login', body);
  }

  public register(body: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<any>(environment.API_URL + 'auth/register', body);
  }
}

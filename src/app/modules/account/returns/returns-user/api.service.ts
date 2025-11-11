import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../shared/models/api-response.model';
import { Return } from '../return.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReturnsApiService {
  private readonly baseUrl = `${environment.API_URL}account/returns/user`;

  constructor(private http: HttpClient) {}

  getDevoluciones(): Observable<ApiResponse<Return[]>> {
    return this.http.get<ApiResponse<Return[]>>(this.baseUrl).pipe(
      map((res) => ({
        ...res,
        payload: Return.adaptList(res.payload),
      }))
    );
  }
}

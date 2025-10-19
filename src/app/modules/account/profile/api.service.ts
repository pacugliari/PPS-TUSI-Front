import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { Profile, ProfileModel, ProfileUpsertDto } from './profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly baseUrl = `${environment.API_URL}account/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<Profile>> {
    return this.http.get<ApiResponse<Profile>>(this.baseUrl);
  }

  updateProfile(dto: ProfileUpsertDto): Observable<ApiResponse<Profile>> {
    return this.http.put<ApiResponse<Profile>>(this.baseUrl, dto);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/api-response.model';
import { Profile, ProfileModel, ProfileUpsertDto } from './profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly baseUrl = `${environment.API_URL}/account/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileModel> {
    return this.http.get<ApiResponse<Profile>>(this.baseUrl).pipe(
      map((res) => ProfileModel.adapt(res.payload)),
      catchError(() =>
        of(
          new ProfileModel(
            '54511',
            'Cugliari, Pablo',
            'pacugliari@hotmail.com',
            '011 3123-5232',
            'DNI',
            '11223344'
          )
        )
      )
    );
  }

  updateProfile(dto: ProfileUpsertDto): Observable<ProfileModel> {
    return this.http.put<ApiResponse<Profile>>(this.baseUrl, dto).pipe(
      map((res) => ProfileModel.adapt(res.payload)),
      catchError(() => of(ProfileModel.adapt(dto)))
    );
  }
}

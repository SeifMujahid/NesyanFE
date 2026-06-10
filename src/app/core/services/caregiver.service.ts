import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaregiverService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';

  getCaregiverProfile(caregiverId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Caregivers/${caregiverId}/profile`,
    );
  }

  editCaregiverProfile(
    caregiverId: number,
    formData: FormData,
  ): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/Caregivers/${caregiverId}`,
      formData,
    );
  }
}

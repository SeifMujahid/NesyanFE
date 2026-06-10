import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';

  getPatientProfile(patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Patients/${patientId}/profile`,
    );
  }

  editPatientProfile(patientId: number, formData: FormData): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/Patients/${patientId}`,
      formData,
    );
  }
}

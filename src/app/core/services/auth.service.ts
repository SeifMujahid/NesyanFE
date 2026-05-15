import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRegisterInterface } from '../interfaces/patient-register-interface';
import { VerifayAccountInterface } from '../interfaces/verifay-account-interface';
import { RelativeRegisterInterface } from '../interfaces/relative-register-interface';
import { CaregiverRegisterInterface } from '../interfaces/caregiver-register-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';

  patientRegister(data: PatientRegisterInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/register-patient`,
      data,
    );
  }
  doctorRegister(data: FormData): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/register-doctor`,
      data,
    );
  }
  relatieRegister(data: RelativeRegisterInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/register-relative`,
      data,
    );
  }
  caregiverRegister(data: CaregiverRegisterInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/register-caregiver`,
      data,
    );
  }

  verifyAccount(data: VerifayAccountInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/verify-account`,
      data,
    );
  }
}

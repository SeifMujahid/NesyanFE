import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRegisterInterface } from '../interfaces/patient-register-interface';
import { VerifayAccountInterface } from '../interfaces/verifay-account-interface';
import { RelativeRegisterInterface } from '../interfaces/relative-register-interface';
import { CaregiverRegisterInterface } from '../interfaces/caregiver-register-interface';
import { LoginInterface } from '../interfaces/login-interface';
import { ForgetPasswordInterface } from '../interfaces/forget-password-interface';
import { ResetPasswordInterface } from '../interfaces/reset-password-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';

  patientRegister(data: FormData): Observable<any> {
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
  relatieRegister(data: FormData): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/register-relative`,
      data,
    );
  }
  caregiverRegister(data: FormData): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/register-caregiver`,
      data,
    );
  }
  login(data: LoginInterface): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}/api/Auth/login`, data);
  }
  verifyAccount(data: VerifayAccountInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/verify-account`,
      data,
    );
  }
  forgetPassword(data: ForgetPasswordInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/forgot-password`,
      data,
    );
  }
  reVerifyEmail(data: ForgetPasswordInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/resend-verification-code`,
      data,
    );
  }
  resetPassword(data: ResetPasswordInterface): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Auth/reset-password`,
      data,
    );
  }
}

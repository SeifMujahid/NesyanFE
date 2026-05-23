import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor() {}

  tempEmail: BehaviorSubject<string> = new BehaviorSubject<string>('');
  logedEmail: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentRole: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentPatientID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentUserId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentUserName: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // Setter methods
  setCurrentRole(role: string): void {
    this.currentRole.next(role);
  }

  setCurrentPatientID(patientID: string): void {
    this.currentPatientID.next(patientID);
  }

  setCurrentUserId(userId: string): void {
    this.currentUserId.next(userId);
  }

  setTempEmail(tempMail: string): void {
    this.tempEmail.next(tempMail);
  }

  setlogedEmail(email: string): void {
    this.logedEmail.next(email);
  }

  setCurrentUserName(userName: string): void {
    this.currentUserName.next(userName);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Clear user data on logout
  clearUserData(): void {
    this.currentRole.next('');
    this.currentUserId.next('');
    this.currentUserName.next('');
    this.logedEmail.next('');
    this.currentPatientID.next('');
    localStorage.removeItem('token');
  }
}

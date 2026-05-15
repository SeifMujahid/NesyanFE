import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor() {}
  registeredEmail: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentRole: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentPatientID: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentUserId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setCurrentRole(role: string) {
    this.currentRole.next(role);
  }

  setCurrentPatientID(patientID: string) {
    this.currentPatientID.next(patientID);
  }

  setCurrentUserId(userId: string) {
    this.currentUserId.next(userId);
  }

  setRegisteredEmail(email: string) {
    this.registeredEmail.next(email);
  }
}

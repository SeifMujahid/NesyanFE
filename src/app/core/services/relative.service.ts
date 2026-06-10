import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AddAppointmentData,
  AddMedicationData,
  AddRoutineData,
} from '../interfaces/patients';
import {
  SendRequest,
  SendRequest2,
  SendRequest3,
} from '../interfaces/treatment-requests';

@Injectable({
  providedIn: 'root',
})
export class RelativeService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';
  getRelativePatientList(relativeId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients`,
    );
  }
  getPatientMedications(
    relativeId: number,
    patientId: number,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders`,
      {
        params: { reminderType: 1 },
      },
    );
  }
  addPatientMedication(
    relativeId: number,
    patientId: number,
    data: AddMedicationData,
  ): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders`,
      data,
      { responseType: 'text' },
    );
  }
  deletePatientMedication(
    relativeId: number,
    patientId: number,
    medicationId: number,
  ): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders/${medicationId}`,
    );
  }
  editPatientMedication(
    relativeId: number,
    patientId: number,
    medicationId: number,
    data: AddMedicationData,
  ): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders/${medicationId}`,
      data,
      { responseType: 'text' },
    );
  }
  getPatientRoutines(relativeId: number, patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders`,
      {
        params: { reminderType: 3 },
      },
    );
  }
  addPatientRoutine(
    relativeId: number,
    patientId: number,
    data: AddRoutineData,
  ): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders`,
      data,
      { responseType: 'text' },
    );
  }
  deletePatientRoutine(
    relativeId: number,
    patientId: number,
    routineId: number,
  ): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders/${routineId}`,
    );
  }
  editPatientRoutine(
    relativeId: number,
    patientId: number,
    routineId: number,
    data: AddRoutineData,
  ): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders/${routineId}`,
      data,
      { responseType: 'text' },
    );
  }
  getPatientAppointment(
    relativeId: number,
    patientId: number,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders`,
      {
        params: { reminderType: 2 },
      },
    );
  }
  addPatientAppointment(
    relativeId: number,
    patientId: number,
    data: AddAppointmentData,
  ): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders`,
      data,
      { responseType: 'text' },
    );
  }
  deletePatientAppointment(
    relativeId: number,
    patientId: number,
    appointmentId: number,
  ): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders/${appointmentId}`,
    );
  }
  editPatientAppointment(
    relativeId: number,
    patientId: number,
    appointmentId: number,
    data: AddAppointmentData,
  ): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/patients/${patientId}/reminders/${appointmentId}`,
      data,
      { responseType: 'text' },
    );
  }
  gitPatientFamilyMembersList(patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/FamilyMembers/patient/${patientId}`,
    );
  }
  deletePatientFamilyMember(memberId: number): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/FamilyMembers/${memberId}`,
    );
  }
  addPatientFamilyMember(memberData: FormData): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/FamilyMembers`,
      memberData,
    );
  }
  getPendingTreatmentRequests(
    relativeId: number,
    orderType: number = 1,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${relativeId}/relative-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }
  getAcceptedTreatmentRequests(
    relativeId: number,
    orderType: number = 0,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${relativeId}/relative-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }
  getRejectedTreatmentRequests(
    relativeId: number,
    orderType: number = 3,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${relativeId}/relative-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }
  acceptTratmentRequest(
    relativeId: number,
    requestId: number,
  ): Observable<any> {
    return this._httpClient.patch(
      `${this.baseUrl}/api/TreatmentRequests/${requestId}/relative-select`,
      {},
      {
        params: { relativeId: relativeId },
        responseType: 'text',
      },
    );
  }
  rejectTreatmentRequest(
    relativeId: number,
    requestId: number,
  ): Observable<any> {
    return this._httpClient.patch(
      `${this.baseUrl}/api/TreatmentRequests/${requestId}/relative-reject`,
      {},
      {
        params: { relativeId: relativeId },
        responseType: 'text',
      },
    );
  }
  sendTreatmentRequest(data: SendRequest): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/TreatmentRequests`,
      data,
      {
        responseType: 'text',
      },
    );
  }
  getNesyanDoctors(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/api/Doctor`);
  }
  createNewPatientAccount(relativeId: number, data: FormData): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/RelativePatients/${relativeId}/register-patient`,
      data,
    );
  }
  createRelation(relativeID: number, patientID: number): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/RelativePatients/create-relation`,
      {},
      {
        params: { relativeId: relativeID, patientId: patientID },
        responseType: 'text',
      },
    );
  }
  addExistingPatient(relativeID: number, data: any): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/RelativePatients/add-existing-patient`,
      data,
      {
        params: { relativeId: relativeID },
        responseType: 'text',
      },
    );
  }

  getRemovedPatients(
    relativeId: number,
    orderType: number = 4,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${relativeId}/relative-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }

  getRelativeProfile(relativeId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Relatives/${relativeId}/profile`,
    );
  }

  editRelativeProfile(relativeId: number, formData: FormData): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/Relatives/${relativeId}`,
      formData,
    );
  }

  sendTreatmentRequest2(data: SendRequest2): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/DoctorPatient/add-patient`,
      data,
      {
        responseType: 'text',
      },
    );
  }

  getDoctorById(id: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/api/Doctor/${id}/profile`);
  }

  requestCaregiver2(data: SendRequest3): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/CaregiverPatient/add-patient`,
      data,
      {
        responseType: 'text',
      },
    );
  }

  getCaregiverById(id: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/api/Caregivers/${id}/profile`);
  }

  getNesyanCaregivers(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/api/Caregivers`);
  }
}

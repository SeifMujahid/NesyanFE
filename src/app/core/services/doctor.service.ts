import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddMedicationData, AddMindGame } from '../interfaces/patients';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';

  getDoctorPatients(doctorId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Doctor/${doctorId}/patients`,
    );
  }
  getPatientMedications(doctorId: number, patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Doctor/${doctorId}/patients/${patientId}/medications`,
    );
  }
  addPatientMedication(
    doctorId: number,
    patientId: number,
    data: AddMedicationData,
  ): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/Doctor/${doctorId}/patients/${patientId}/reminders`,
      data,
      { responseType: 'text' },
    );
  }
  deletePatientMedication(medicationId: number): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/Medications/${medicationId}`,
    );
  }
  editPatientMedication(
    doctorId: number,
    patientId: number,
    medicationId: number,
    data: AddMedicationData,
  ): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/Doctor/${doctorId}/patients/${patientId}/reminders/${medicationId}`,
      data,
      { responseType: 'text' },
    );
  }
  getPatientSummery(doctorId: number, patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Doctor/${doctorId}/patient`,
      { params: { patientId: patientId } },
    );
  }
  updatePatientStage(
    doctorId: number,
    patientId: number,
    newStage: number,
  ): Observable<any> {
    return this._httpClient.patch(
      `${this.baseUrl}/api/Doctor/${doctorId}/patients/${patientId}/stage`,
      {},
      {
        params: { stageNumber: newStage },
        responseType: 'text',
      },
    );
  }
  getPatientsMindGamesList(patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/MindGames/patient/${patientId}`,
    );
  }
  deletePatientMindGame(patientId: number, gameId: number): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/MindGames/patient/${patientId}/remove/${gameId}`,
    );
  }
  getAllMindGames(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/api/MindGames/catalog`);
  }
  addPatientMindGame(
    patientId: number,
    gameId: number,
    data: AddMindGame,
  ): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/MindGames/patient/${patientId}/assign/${gameId}`,
      data,
    );
  }
  getPendingTreatmentRequests(
    doctorId: number,
    orderType: number = 1,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${doctorId}/doctor-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }
  getAcceptedTreatmentRequests(
    doctorId: number,
    orderType: number = 0,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${doctorId}/doctor-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }
  getRejectedTreatmentRequests(
    doctorId: number,
    orderType: number = 3,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${doctorId}/doctor-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }
  acceptTratmentRequest(doctorID: number, requestId: number): Observable<any> {
    return this._httpClient.patch(
      `${this.baseUrl}/api/TreatmentRequests/${requestId}/doctor-accept`,
      {},
      {
        params: { doctorId: doctorID },
        responseType: 'text',
      },
    );
  }
  rejectTreatmentRequest(doctorID: number, requestId: number): Observable<any> {
    return this._httpClient.patch(
      `${this.baseUrl}/api/TreatmentRequests/${requestId}/doctor-reject`,
      {},
      {
        params: { doctorId: doctorID },
        responseType: 'text',
      },
    );
  }

  getSelectedTreatmentRequests(
    doctorId: number,
    orderType: number = 2,
  ): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/TreatmentRequests/doctor/${doctorId}/doctor-requests`,
      {
        params: { orderType: orderType },
      },
    );
  }
  getPatientReport(patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Doctor/patient/${patientId}/report`,
    );
  }

  getDoctorProfile(doctorId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/Doctor/${doctorId}/profile`,
    );
  }

  editDoctorProfile(doctorId: number, formData: FormData): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/Doctor/${doctorId}`,
      formData,
    );
  }

  getDoctorPatients2(doctorId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/DoctorPatient/doctor/${doctorId}/patients`,
    );
  }

  removeDoctorPatient2(doctorId: number, patientId: number): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/DoctorPatient/doctor/${doctorId}/patient/${patientId}`,
    );
  }
}

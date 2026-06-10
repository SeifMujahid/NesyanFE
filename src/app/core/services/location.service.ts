import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CircleLocation, PolygonLocation } from '../interfaces/location';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';

  addCircleSafeZone(
    patientId: number,
    circleData: CircleLocation,
  ): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones`,
      circleData,
    );
  }

  addPolygonSafeZone(
    patientId: number,
    polygonData: PolygonLocation,
  ): Observable<any> {
    return this._httpClient.post(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones`,
      polygonData,
    );
  }

  getPatientSafeZones(patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones`,
    );
  }

  deletePatientSafeZone(
    patientId: number,
    safeZoneId: number,
  ): Observable<any> {
    return this._httpClient.delete(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones/${safeZoneId}`,
    );
  }

  editCircleSafeZone(
    patientId: number,
    safeZoneId: number,
    editCircleData: CircleLocation,
  ): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones/${safeZoneId}`,
      editCircleData,
    );
  }

  editPolygonSafeZone(
    patientId: number,
    safeZoneId: number,
    editPolygonData: PolygonLocation,
  ): Observable<any> {
    return this._httpClient.put(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones/${safeZoneId}`,
      editPolygonData,
    );
  }

  getCurrentLoaction(patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/v1/patients/${patientId}/location/current`,
    );
  }

  getViolations(patientId: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}/api/v1/patients/${patientId}/location/violations`,
    );
  }
}

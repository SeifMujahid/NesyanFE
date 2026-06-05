import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CircleLocation, PolygonLocation } from '../interfaces/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private _httpClient: HttpClient) {}
  baseUrl: string = 'https://nesyan-api.runasp.net';

  addCircleSafeZone(patientId: number, circleData: CircleLocation) {
    return this._httpClient.post(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones`,
      circleData,
    );
  }

  addPolygonSafeZone(patientId: number, polygonData: PolygonLocation) {
    return this._httpClient.post(
      `${this.baseUrl}/api/v1/patients/${patientId}/safe-zones`,
      polygonData,
    );
  }
}

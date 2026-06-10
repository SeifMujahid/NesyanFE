export interface Location {
  name: string;
  phone: string;
  type: number;
  geometry: Geometry;
}

export interface CircleLocation {
  name: string;
  phone: string;
  type: number;
  geometry: CircleGeometry;
}

export interface PolygonLocation {
  name: string;
  phone: string;
  type: number;
  geometry: PolygonGeometry;
}

export interface CircleGeometry {
  center: Center;
  radius: number;
}

export interface PolygonGeometry {
  points: Point[];
}

export interface SafeZone {
  safeZoneId: string;
  patientId: number;
  name: string;
  phone: string;
  type: number;
  geometry: Geometry;
  isActive: boolean;
  createdAt: string;
}

export interface Geometry {
  center: Center;
  radius: number;
  points: Point[];
}

export interface Center {
  lat: number;
  lng: number;
}

export interface Point {
  lat: number;
  lng: number;
}

export interface CurrentLocation {
  patientId: string;
  name: string;
  lastKnownLocation: LastKnownLocation;
  geofenceStatus: string;
  activeBreaches: ActiveBreach[];
}

export interface LastKnownLocation {
  lat: number;
  lng: number;
  updatedAt: string;
}

export interface ActiveBreach {
  safeZoneId: string;
  zoneName: string;
  exitedAt: string;
}

export interface Violation {
  violationId: string;
  safeZoneId: string;
  zoneName: string;
  exitedAt: string;
  enteredAt: string;
  durationMinutes: number;
  status: string;
}

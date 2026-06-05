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

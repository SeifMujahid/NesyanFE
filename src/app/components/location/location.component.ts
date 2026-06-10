// location.component.ts
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import { LocationService } from 'src/app/core/services/location.service';
import { RelativeService } from 'src/app/core/services/relative.service';
import {
  Center,
  CircleLocation,
  CurrentLocation,
  Point,
  PolygonLocation,
  SafeZone,
  Violation,
} from 'src/app/core/interfaces/location';
import { CleanDatePipe } from 'src/app/core/pipelines/clean-date.pipe';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, ReactiveFormsModule, CleanDatePipe],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  patientId: number = 0;
  circleData: CircleLocation = {} as CircleLocation;
  polygonData: PolygonLocation = {} as PolygonLocation;
  circleEditData: CircleLocation = {} as CircleLocation;
  polygonEditData: PolygonLocation = {} as PolygonLocation;
  patientCurrentLocation: CurrentLocation = {} as CurrentLocation;
  patientViolations: Violation[] = [];
  pLat: any = 30.0444;
  pLag: any = 31.2357;
  center: google.maps.LatLngLiteral = { lat: this.pLat, lng: this.pLag };
  zoom = 14;

  drawnCircle: google.maps.Circle | null = null;
  drawnPolygon: google.maps.Polygon | null = null;
  polygonPointsArray: Point[] = [];
  isDrawing: boolean = false;
  mapReady: boolean = false;
  isEditing: boolean = false;
  editingZoneId: number = 0;

  patientSafeZones: SafeZone[] = [];

  constructor(
    private _mainService: MainService,
    private _locationService: LocationService,
    private _relativeService: RelativeService,
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this._mainService.currentPatientID.subscribe((patientID) => {
      this.patientId = Number(patientID);
      this.getPatientCurrentLocation();
      this.getPatientSafeZones();
      this.getPatientViolations();
    });
  }

  ngAfterViewInit(): void {
    if (this.map?.googleMap) {
      this.mapReady = true;
      console.log('Map loaded successfully');
    }
  }

  zoneForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern('^01[0125][0-9]{8}$'),
    ]),
  });

  getPatientCurrentLocation(): void {
    this._locationService.getCurrentLoaction(this.patientId).subscribe({
      next: (response) => {
        this.patientCurrentLocation = response;
        if (
          this.patientCurrentLocation.lastKnownLocation === null ||
          this.patientCurrentLocation.lastKnownLocation.lat === null ||
          this.patientCurrentLocation.lastKnownLocation.lng === null
        ) {
          this.pLat = 30.0444;
          this.pLag = 31.2357;
          this.showError('Current Patient Location not found');
        } else {
          this.pLat = this.patientCurrentLocation.lastKnownLocation.lat;
          this.pLag = this.patientCurrentLocation.lastKnownLocation.lng;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPatientSafeZones(): void {
    this._locationService.getPatientSafeZones(this.patientId).subscribe({
      next: (response) => {
        this.patientSafeZones = response;
        console.log(this.patientSafeZones);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePatientSafeZone(zoneId: string): void {
    const safeZoneId = Number(zoneId.substring(3));
    this._locationService
      .deletePatientSafeZone(this.patientId, safeZoneId)
      .subscribe({
        next: (response) => {
          this.showSuccess('Safe Zone Removed Sucessfuly.');
          this.getPatientSafeZones();
        },
        error: (err) => {
          this.showError('Failed to remove safe zone.');
          console.log(err);
        },
      });
  }

  getPatientViolations(): void {
    this._locationService.getViolations(this.patientId).subscribe({
      next: (response) => {
        this.patientViolations = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editPatientZone(zoneId: string, index: number): void {
    const selectedZone = this.patientSafeZones[index];

    if (!selectedZone) {
      this.showError('Safe zone not found.');
      return;
    }

    // Set editing flag
    this.isEditing = true;
    this.editingZoneId = Number(zoneId.substring(3));

    // Set form values (name and phone only)
    this.zoneForm.patchValue({
      name: selectedZone.name,
      phone: selectedZone.phone,
    });

    // Draw the circle or polygon automatically based on zone type
    if (selectedZone.type === 1) {
      // Circle type
      this.circleEditData = JSON.parse(
        JSON.stringify(selectedZone),
      ) as CircleLocation;
      this.drowSelectedZoneCircle();
    } else if (selectedZone.type === 0) {
      // Polygon type
      this.polygonEditData = JSON.parse(
        JSON.stringify(selectedZone),
      ) as PolygonLocation;
      this.drowSelectedZonePolygon();
    }
  }

  drowSelectedZoneCircle(): void {
    // Clear previous shapes
    this.clearDrawnShapes();

    if (!this.mapReady || !this.map?.googleMap) {
      this.showError('Map not loaded yet. Please try again.');
      return;
    }

    this.isDrawing = true;
    const mapInstance = this.map.googleMap;

    if (!this.circleEditData.geometry?.center) {
      this.showError('Circle data is missing.');
      return;
    }

    // Create circle on map with existing data
    this.drawnCircle = new google.maps.Circle({
      center: this.circleEditData.geometry.center,
      radius: this.circleEditData.geometry.radius,
      map: mapInstance,
      fillColor: '#FFD700',
      fillOpacity: 0.2,
      strokeColor: '#FFD700',
      strokeWeight: 2,
      editable: true,
      draggable: true,
      zIndex: 10,
    });

    // Listen for radius changes
    this.drawnCircle.addListener('radius_changed', () => {
      this.circleEditData.geometry.radius = this.drawnCircle!.getRadius() || 0;
    });

    // Listen for center changes
    this.drawnCircle.addListener('center_changed', () => {
      const newCenter = this.drawnCircle!.getCenter();
      if (newCenter) {
        this.circleEditData.geometry.center = {
          lat: newCenter.lat(),
          lng: newCenter.lng(),
        };
      }
    });

    this.showSuccess('Edit the circle and form as needed.');
  }

  drowSelectedZonePolygon(): void {
    // Clear previous shapes
    this.clearDrawnShapes();

    if (!this.mapReady || !this.map?.googleMap) {
      this.showError('Map not loaded yet. Please try again.');
      return;
    }

    this.isDrawing = true;
    const mapInstance = this.map.googleMap;

    if (
      !this.polygonEditData.geometry?.points ||
      this.polygonEditData.geometry.points.length < 3
    ) {
      this.showError('Polygon data is missing.');
      return;
    }

    this.polygonPointsArray = [...this.polygonEditData.geometry.points];

    // Create polygon with existing data
    this.drawnPolygon = new google.maps.Polygon({
      paths: this.polygonPointsArray,
      map: mapInstance,
      fillColor: '#FFD700',
      fillOpacity: 0.2,
      strokeColor: '#FFD700',
      strokeWeight: 2,
      editable: true,
      draggable: true,
      zIndex: 10,
    });

    // 👇 IMPROVED: Listen for path changes with better sync
    const pathChangeListener = this.drawnPolygon.addListener(
      'path_changed',
      () => {
        const path = this.drawnPolygon!.getPath();
        const updatedPoints: Point[] = [];

        // Use getAt to properly iterate over MVCArray
        for (let i = 0; i < path.getLength(); i++) {
          const latLng = path.getAt(i);
          updatedPoints.push({
            lat: latLng.lat(),
            lng: latLng.lng(),
          });
        }

        // Update both arrays
        this.polygonPointsArray = updatedPoints;
        this.polygonEditData.geometry.points = updatedPoints;

        console.log('Polygon points updated:', updatedPoints);
      },
    );

    this.showSuccess('Edit the polygon and form as needed.');
  }

  completeEditPatientSafeZone(): void {
    if (this.circleEditData.type === 1) {
      // Circle edit - validate
      if (
        this.zoneForm.valid &&
        this.circleEditData.geometry?.center &&
        this.circleEditData.geometry?.radius
      ) {
        this.circleEditData.name = this.zoneForm.value.name;
        this.circleEditData.phone = this.zoneForm.value.phone;
        this.editPatientSafeZoneCircle();
      } else {
        if (this.zoneForm.invalid) {
          this.showError('Please fill in all required fields with valid data.');
        } else {
          this.showError('Please draw the circle on the map.');
        }
      }
    } else if (this.polygonEditData.type === 0) {
      // Polygon edit - validate
      if (
        this.zoneForm.valid &&
        this.polygonEditData.geometry?.points &&
        this.polygonEditData.geometry.points.length >= 3
      ) {
        // 👇 Capture the latest polygon path from the drawn shape
        if (this.drawnPolygon) {
          const path = this.drawnPolygon.getPath();
          const finalPoints: Point[] = [];
          for (let i = 0; i < path.getLength(); i++) {
            const latLng = path.getAt(i);
            finalPoints.push({
              lat: latLng.lat(),
              lng: latLng.lng(),
            });
          }
          this.polygonEditData.geometry.points = finalPoints;
        }

        this.polygonEditData.name = this.zoneForm.value.name;
        this.polygonEditData.phone = this.zoneForm.value.phone;
        this.editPatientSafeZonePolygon();
      } else {
        if (this.zoneForm.invalid) {
          this.showError('Please fill in all required fields with valid data.');
        } else {
          this.showError(
            'Please draw the polygon on the map with at least 3 points.',
          );
        }
      }
    }
  }

  editPatientSafeZoneCircle(): void {
    this._locationService
      .editCircleSafeZone(
        this.patientId,
        this.editingZoneId,
        this.circleEditData,
      )
      .subscribe({
        next: (response) => {
          this.showSuccess('Circle safe zone updated successfully.');
          this.getPatientSafeZones();
          console.log(this.circleEditData);
          console.log(response);
          this.resetForm();
        },
        error: (err) => {
          this.showError(
            'Failed to update circle safe zone. Please try again.',
          );
          console.log(err);
          this.resetForm();
        },
      });
  }

  editPatientSafeZonePolygon(): void {
    this._locationService
      .editPolygonSafeZone(
        this.patientId,
        this.editingZoneId,
        this.polygonEditData,
      )
      .subscribe({
        next: (response) => {
          this.showSuccess('Polygon safe zone updated successfully.');
          this.getPatientSafeZones();
          console.log(this.polygonEditData);
          console.log(response);
          this.resetForm();
        },
        error: (err) => {
          this.showError(
            'Failed to update polygon safe zone. Please try again.',
          );
          console.log(err);
          this.resetForm();
        },
      });
  }

  chooseZoneType(type: number): void {
    if (type === 1) {
      this.circleData.type = type;
      this.drowCircle();
    } else if (type === 0) {
      this.polygonData.type = type;
      this.drowPolygon();
    }
  }

  drowCircle(): void {
    // Clear previous shapes
    this.clearDrawnShapes();

    if (!this.mapReady || !this.map?.googleMap) {
      this.showError('Map not loaded yet. Please try again.');
      return;
    }

    this.isDrawing = true;
    this.showSuccess('Click on the map to set circle center');

    const mapInstance = this.map.googleMap;
    let centerSet = false;

    // First click - set center
    const centerClickListener = mapInstance.addListener(
      'click',
      (event: google.maps.MapMouseEvent) => {
        if (!centerSet) {
          const centerPoint: Center = {
            lat: event.latLng!.lat(),
            lng: event.latLng!.lng(),
          };

          // Initialize circle data if not already done
          if (!this.circleData.geometry) {
            this.circleData.geometry = {
              center: centerPoint,
              radius: 100,
            };
          } else {
            this.circleData.geometry.center = centerPoint;
            this.circleData.geometry.radius = 100;
          }

          // Create circle on map
          this.drawnCircle = new google.maps.Circle({
            center: centerPoint,
            radius: 100,
            map: mapInstance,
            fillColor: '#FF6B6B',
            fillOpacity: 0.2,
            strokeColor: '#FF6B6B',
            strokeWeight: 2,
            editable: true,
            draggable: true,
            zIndex: 10,
          });

          centerSet = true;
          centerClickListener.remove();

          // Listen for radius changes
          this.drawnCircle.addListener('radius_changed', () => {
            this.circleData.geometry.radius =
              this.drawnCircle!.getRadius() || 0;
          });

          // Listen for center changes
          this.drawnCircle.addListener('center_changed', () => {
            const newCenter = this.drawnCircle!.getCenter();
            if (newCenter) {
              this.circleData.geometry.center = {
                lat: newCenter.lat(),
                lng: newCenter.lng(),
              };
            }
          });

          this.showSuccess('Drag the circle edge to adjust radius');
        }
      },
    );
  }

  drowPolygon(): void {
    // Clear previous shapes
    this.clearDrawnShapes();

    if (!this.mapReady || !this.map?.googleMap) {
      this.showError('Map not loaded yet. Please try again.');
      return;
    }

    this.isDrawing = true;
    this.polygonPointsArray = [];
    this.showSuccess(
      'Click on the map to add polygon points. Double-click to finish.',
    );

    const mapInstance = this.map.googleMap;

    // Initialize polygon data if not already done
    if (!this.polygonData.geometry) {
      this.polygonData.geometry = {
        points: [],
      };
    } else {
      this.polygonData.geometry.points = [];
    }

    // Create polygon
    this.drawnPolygon = new google.maps.Polygon({
      map: mapInstance,
      fillColor: '#4ECDC4',
      fillOpacity: 0.2,
      strokeColor: '#4ECDC4',
      strokeWeight: 2,
      editable: true,
      draggable: true,
      zIndex: 10,
    });

    // Click listener to add points
    const clickListener = mapInstance.addListener(
      'click',
      (event: google.maps.MapMouseEvent) => {
        const point: Point = {
          lat: event.latLng!.lat(),
          lng: event.latLng!.lng(),
        };

        this.polygonPointsArray.push(point);
        this.polygonData.geometry.points = [...this.polygonPointsArray];
        this.drawnPolygon!.setPath(this.polygonPointsArray);

        console.log(
          `Point added. Total points: ${this.polygonPointsArray.length}`,
        );
      },
    );

    // Double-click listener to finish
    const dblClickListener = mapInstance.addListener('dblclick', () => {
      if (this.polygonPointsArray.length >= 3) {
        clickListener.remove();
        dblClickListener.remove();
        this.isDrawing = false;

        // Listen for path changes
        this.drawnPolygon!.addListener('path_changed', () => {
          const path = this.drawnPolygon!.getPath();
          const updatedPoints: Point[] = [];

          path?.forEach((latLng) => {
            updatedPoints.push({
              lat: latLng.lat(),
              lng: latLng.lng(),
            });
          });

          this.polygonData.geometry.points = updatedPoints;
        });

        this.showSuccess('Polygon ready to save. Click Save button.');
      } else {
        this.showError('Polygon needs at least 3 points');
      }
    });
  }

  completeCircleData(): void {
    if (
      this.zoneForm.valid &&
      this.circleData.geometry?.center &&
      this.circleData.geometry?.radius
    ) {
      this.circleData.name = this.zoneForm.value.name;
      this.circleData.phone = this.zoneForm.value.phone;
      this.saveCircleSafeZone();
    } else {
      if (this.zoneForm.invalid) {
        this.showError('Please fill in all required fields with valid data.');
      } else {
        this.showError('Please draw the circle on the map.');
      }
    }
  }

  chooseSaveType(): void {
    if (this.isEditing) {
      this.completeEditPatientSafeZone();
    } else {
      if (this.circleData.type === 1) {
        this.completeCircleData();
      } else if (this.polygonData.type === 0) {
        this.completePolygonData();
      }
    }
  }

  completePolygonData(): void {
    if (
      this.zoneForm.valid &&
      this.polygonData.geometry?.points &&
      this.polygonData.geometry.points.length >= 3
    ) {
      // 👇 Ensure we capture the latest polygon path from the drawn shape
      if (this.drawnPolygon) {
        const path = this.drawnPolygon.getPath();
        const finalPoints: Point[] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const latLng = path.getAt(i);
          finalPoints.push({
            lat: latLng.lat(),
            lng: latLng.lng(),
          });
        }
        this.polygonData.geometry.points = finalPoints;
      }

      this.polygonData.name = this.zoneForm.value.name;
      this.polygonData.phone = this.zoneForm.value.phone;
      this.savePolygonSafeZone();
    } else {
      if (this.zoneForm.invalid) {
        this.showError('Please fill in all required fields with valid data.');
      } else {
        this.showError(
          'Please draw the polygon on the map with at least 3 points.',
        );
      }
    }
  }

  saveCircleSafeZone(): void {
    this._locationService
      .addCircleSafeZone(this.patientId, this.circleData)
      .subscribe({
        next: (response) => {
          this.showSuccess('Circle safe zone added successfully.');
          this.getPatientSafeZones();
          console.log(this.circleData);
          console.log(response);
          this.resetForm();
        },
        error: (err) => {
          this.showError('Failed to add circle safe zone. Please try again.');
          console.log(err);
          this.resetForm();
        },
      });
  }

  savePolygonSafeZone(): void {
    this._locationService
      .addPolygonSafeZone(this.patientId, this.polygonData)
      .subscribe({
        next: (response) => {
          this.showSuccess('Polygon safe zone added successfully.');
          this.getPatientSafeZones();
          console.log(this.polygonData);
          console.log(response);
          this.resetForm();
        },
        error: (err) => {
          this.showError('Failed to add polygon safe zone. Please try again.');
          console.log(err);
          this.resetForm();
        },
      });
  }

  cancleZone(): void {
    this.clearDrawnShapes();
    this.resetForm();
  }

  clearDrawnShapes(): void {
    if (this.drawnCircle) {
      this.drawnCircle.setMap(null);
      this.drawnCircle = null;
    }

    if (this.drawnPolygon) {
      this.drawnPolygon.setMap(null);
      this.drawnPolygon = null;
    }

    this.polygonPointsArray = [];
    this.isDrawing = false;
  }

  resetForm(): void {
    this.circleData = {} as CircleLocation;
    this.polygonData = {} as PolygonLocation;
    this.circleEditData = {} as CircleLocation;
    this.polygonEditData = {} as PolygonLocation;
    this.clearDrawnShapes();
    this.isEditing = false;
    this.editingZoneId = 0;
    this.zoneForm.reset({
      name: null,
      phone: null,
    });
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }

  showError(message: string): void {
    this.toastr.error(message);
  }
}

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import { PatientPeofile, Assessment } from 'src/app/core/interfaces/patients';
import { PatientService } from 'src/app/core/services/patient.service';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, MainNavComponent],
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
})
export class PatientProfileComponent implements OnInit, OnDestroy {
  patientProfile: PatientPeofile = {} as PatientPeofile;
  imagePreview: string | null = null;
  lastAssessment: Assessment | null = null;
  currentRole: string = '';

  private destroy$ = new Subject<void>();
  toastr = inject(ToastrService);

  constructor(
    private _patientService: PatientService,
    private _mainService: MainService,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Read role ONCE synchronously — do not put it inside a stream
    this.currentRole = this._mainService.currentRole
      .getValue()
      .toLocaleLowerCase();

    const id$ =
      this.currentRole === 'patient'
        ? this._mainService.currentUserId
        : this._mainService.currentPatientID;

    // First, check for query params (priority), then fall back to service
    this._route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          const patientIDFromRoute = params['patientId'];
          if (patientIDFromRoute) {
            // If patientId is in query params, use it and update the service
            this._mainService.setCurrentPatientID(patientIDFromRoute);
            return this._patientService.getPatientProfile(
              Number(patientIDFromRoute),
            );
          } else {
            // Fall back to service
            return id$.pipe(
              switchMap((patientID) =>
                this._patientService.getPatientProfile(Number(patientID)),
              ),
            );
          }
        }),
      )
      .subscribe({
        next: (response) => {
          this.patientProfile = response;
          this.imagePreview = response.imageUrl ?? null;
          if (response.assessments?.length) {
            this.lastAssessment =
              response.assessments[response.assessments.length - 1];
          } else {
            this.lastAssessment = null;
          }
        },
        error: (err) => console.error(err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

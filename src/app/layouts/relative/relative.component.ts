import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MainNavComponent } from 'src/app/components/main-nav/main-nav.component';
import { RelativeService } from 'src/app/core/services/relative.service';
import { MainService } from 'src/app/context/main.service';
import { RelativePatientsList } from 'src/app/core/interfaces/patients';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  DoctorSummary,
  SendRequest2,
  SendRequest3,
} from 'src/app/core/interfaces/treatment-requests';

@Component({
  selector: 'app-relative',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MainNavComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.scss'],
})
export class RelativeComponent implements OnInit {
  relativePatientsList: RelativePatientsList[] = [];
  patientDetails: RelativePatientsList = {} as RelativePatientsList;
  relativeID: string = '';
  activeIndex: number = 0;

  requestPatientId: number | null = null;
  requestDoctorId: number | null = null;
  requestCaregiverId: number | null = null;
  requestDoctorEmail: string | null = null;
  requestCaregiverEmail: string | null = null;
  activePatientIndex: number | null = null;
  activeDoctorIndex: number | null = null;
  activecaregiverIndex: number | null = null;
  allPatients: RelativePatientsList[] = [];
  allDoctors: DoctorSummary[] = [];
  allCaregivers: any[] = [];

  constructor(
    private _relativeService: RelativeService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  patientData: FormGroup = new FormGroup({
    patientId: new FormControl(null, [
      Validators.required,
      Validators.pattern('^\\d{14}$'),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((userId) => {
      this.relativeID = userId;
      this.getRelativePatientList();
      this.getPatientsList();
      this.getDoctorsList();
      this.getCareGiersList();
    });
  }

  getRelativePatientList(): void {
    this._relativeService
      .getRelativePatientList(Number(this.relativeID))
      .subscribe({
        next: (response) => {
          this.relativePatientsList = response.patientsSummary;
          this.patientDetails = this.relativePatientsList[0];
          this._mainService.setCurrentPatientID(
            this.relativePatientsList[0].patientId.toString(),
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  selectPatient(patientID: number, index: number) {
    this._mainService.setCurrentPatientID(patientID.toString());
    this.activeIndex = index;
    this.patientDetails = this.relativePatientsList[index];
  }

  addNewPatient(): void {
    if (this.patientData.valid) {
      this._relativeService
        .addExistingPatient(Number(this.relativeID), {
          nationalId: this.patientData.value.patientId,
          email: this.patientData.value.email,
        })
        .subscribe({
          next: (response) => {
            this.showSuccess('Patient Added Sucessfully');
            this.getRelativePatientList();
          },
          error: (err) => {
            this.showError('Faild To Add Patient');
            console.log(err);
          },
        });
      this.patientData.reset({
        patientId: null,
        email: null,
      });
    } else {
      this.showError("Invalid Patient's Data");
      this.patientData.reset({
        patientId: null,
        email: null,
      });
    }
  }

  selectPatientRequest(patientID: number, index: number) {
    this.requestPatientId = patientID;
    this.activePatientIndex = index;
  }

  selectDoctor(doctorID: number, index: number) {
    this.activeDoctorIndex = index;
    if (doctorID != null) {
      this._relativeService.getDoctorById(doctorID).subscribe({
        next: (response) => {
          this.requestDoctorId = response.nationalId;
          this.requestDoctorEmail = response.email;
        },
      });
    }
  }

  selectCaregiver(caregiverID: number, index: number) {
    this.activecaregiverIndex = index;
    if (caregiverID != null) {
      this._relativeService.getCaregiverById(caregiverID).subscribe({
        next: (response) => {
          this.requestCaregiverId = response.nationalId;
          this.requestCaregiverEmail = response.email;
        },
      });
    }
  }

  sendNewRequest() {
    if (
      this.requestPatientId != null &&
      this.requestDoctorId != null &&
      this.requestDoctorEmail != null
    ) {
      const requestData: SendRequest2 = {
        nationalIdDoctor: this.requestDoctorId,
        emailDoctor: this.requestDoctorEmail,
        patientId: this.requestPatientId,
      };
      this._relativeService.sendTreatmentRequest2(requestData).subscribe({
        next: (response) => {
          this.showSuccess('Requested Sucessfully');
        },
        error: (err) => {
          this.showError('Faild To Request');
          console.log(err);
        },
      });
    } else {
      this.showError('Follow The Steps To Request');
    }
  }

  sendNewRequestCaregiver() {
    if (
      this.requestPatientId != null &&
      this.requestCaregiverId != null &&
      this.requestCaregiverEmail != null
    ) {
      const requestData: SendRequest3 = {
        nationalIdcaregavier: this.requestCaregiverId,
        emailcaregavier: this.requestCaregiverEmail,
        patientId: this.requestPatientId,
      };
      this._relativeService.requestCaregiver2(requestData).subscribe({
        next: (response) => {
          this.showSuccess('Requested Sucessfully');
        },
        error: (err) => {
          this.showError('Faild To Request');
          console.log(err);
        },
      });
    } else {
      this.showError('Follow The Steps To Request');
    }
  }

  getPatientsList(): void {
    this._relativeService
      .getRelativePatientList(Number(this.relativeID))
      .subscribe({
        next: (response) => {
          this.allPatients = response.patientsSummary;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getDoctorsList(): void {
    this._relativeService.getNesyanDoctors().subscribe({
      next: (response) => {
        this.allDoctors = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCareGiersList(): void {
    this._relativeService.getNesyanCaregivers().subscribe({
      next: (response) => {
        this.allCaregivers = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }
  showError(message: string): void {
    this.toastr.error(message);
  }
}

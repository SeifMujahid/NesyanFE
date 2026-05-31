import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import {
  DoctorSummary,
  TreatmentRequests,
} from 'src/app/core/interfaces/treatment-requests';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { RelativeService } from 'src/app/core/services/relative.service';
import { RouterLink } from '@angular/router';
import { RelativePatientsList } from 'src/app/core/interfaces/patients';

@Component({
  selector: 'app-request-treatment',
  standalone: true,
  imports: [CommonModule, MainNavComponent, RouterLink],
  templateUrl: './request-treatment.component.html',
  styleUrls: ['./request-treatment.component.scss'],
})
export class RequestTreatmentComponent implements OnInit {
  requests: TreatmentRequests[] = [];
  requestDetails: DoctorSummary = {} as DoctorSummary;
  allPatients: RelativePatientsList[] = [];
  allDoctors: DoctorSummary[] = [];
  relativeId: number = 0;
  filter: string = '';
  requestPatientId: number | null = null;
  requestDoctorId: number | null = null;
  activePatientIndex: number | null = null;
  activeDoctorIndex: number | null = null;

  constructor(
    private _mainService: MainService,
    private _relativeServices: RelativeService,
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((relativeId) => {
      this.relativeId = Number(relativeId);
      this.filter = 'pending';
      this.getPendingRequests();
      this.getPatientsList();
      this.getDoctorsList();
    });
  }

  getPatientsList(): void {
    this._relativeServices
      .getRelativePatientList(Number(this.relativeId))
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
    this._relativeServices.getNesyanDoctors().subscribe({
      next: (response) => {
        this.allDoctors = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPendingRequests(): void {
    this._relativeServices
      .getPendingTreatmentRequests(this.relativeId)
      .subscribe({
        next: (response) => {
          this.requests = response;
          this.filter = 'pending';
          console.log('pending', this.requests);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getAcceptedRequests(): void {
    this._relativeServices
      .getAcceptedTreatmentRequests(this.relativeId)
      .subscribe({
        next: (response) => {
          this.requests = response;
          this.filter = 'accepted';
          console.log('accepted', this.requests);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getRemovedPatients(): void {
    this._relativeServices.getRemovedPatients(this.relativeId).subscribe({
      next: (response) => {
        this.requests = response;
        this.filter = 'removed';
        console.log('removed', this.requests);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getRejectedRequests(): void {
    this._relativeServices
      .getRejectedTreatmentRequests(this.relativeId)
      .subscribe({
        next: (response) => {
          this.requests = response;
          this.filter = 'rejected';
          console.log('rejected', this.requests);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  selectRequest(requestId: number): void {
    this._relativeServices
      .acceptTratmentRequest(this.relativeId, requestId)
      .subscribe({
        next: (response) => {
          this.showSuccess('Doctor Selected Sucessfuly');
          this.getAcceptedRequests();
        },
        error: (err) => {
          this.showError("Couldn't Select Doctor");
          console.log(err);
        },
      });
  }

  cancelRequest(requestId: number): void {
    this._relativeServices
      .rejectTreatmentRequest(this.relativeId, requestId)
      .subscribe({
        next: (response) => {
          this.showSuccess('Request Cancelled Sucessfuly');
          this.getAcceptedRequests();
        },
        error: (err) => {
          this.showError("Couldn't Cancelled Request");
          console.log(err);
        },
      });
  }

  acceptRemove(requestId: number): void {
    this._relativeServices
      .rejectTreatmentRequest(this.relativeId, requestId)
      .subscribe({
        next: (response) => {
          this.showSuccess('Removment Accepted Sucessfuly');
          this.getRemovedPatients();
        },
        error: (err) => {
          this.showError("Couldn't Accept Removment");
          console.log(err);
        },
      });
  }

  viewDetails(index: number): void {
    this.requestDetails = this.requests[index].doctorSummary;
  }

  selectPatient(patientID: number, index: number) {
    this.requestPatientId = patientID;
    this.activePatientIndex = index;
  }

  selectDoctor(doctorID: number, index: number) {
    this.requestDoctorId = doctorID;
    this.activeDoctorIndex = index;
  }

  sendNewRequest() {
    if (this.requestPatientId != null && this.requestDoctorId != null) {
      this._relativeServices
        .sendTreatmentRequest({
          patientId: this.requestPatientId!,
          doctorId: this.requestDoctorId!,
          relativeId: this.relativeId,
        })
        .subscribe({
          next: (response) => {
            this.showSuccess('Requested Sucessfully');
            this.getPendingRequests();
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

  showSuccess(message: string): void {
    this.toastr.success(message);
  }
  showError(message: string): void {
    this.toastr.error(message);
  }
}

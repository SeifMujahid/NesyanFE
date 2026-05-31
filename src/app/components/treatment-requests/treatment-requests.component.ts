import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { RouterLink } from '@angular/router';
import { TreatmentRequests } from 'src/app/core/interfaces/treatment-requests';
import { MainService } from 'src/app/context/main.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-treatment-requests',
  standalone: true,
  imports: [CommonModule, MainNavComponent, RouterLink],
  templateUrl: './treatment-requests.component.html',
  styleUrls: ['./treatment-requests.component.scss'],
})
export class TreatmentRequestsComponent implements OnInit {
  requests: TreatmentRequests[] = [];
  requestDetails: TreatmentRequests = {
    patientInfo: {
      patientSummary: {} as any,
      patientMedical: {} as any,
      latestAssessment:{}as any
    },
    relativeSummary: {} as any,
  } as TreatmentRequests;
  chronicDiseases: string[] = [];
  doctorId: number = 0;
  filter: string = '';

  constructor(
    private _mainService: MainService,
    private _doctorServices: DoctorService,
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((doctorId) => {
      this.doctorId = Number(doctorId);
      this.filter = 'pending';
      this.getPendingRequests();
    });
  }

  getPendingRequests(): void {
    this._doctorServices.getPendingTreatmentRequests(this.doctorId).subscribe({
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
    this._doctorServices.getAcceptedTreatmentRequests(this.doctorId).subscribe({
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

  getRejectedRequests(): void {
    this._doctorServices.getRejectedTreatmentRequests(this.doctorId).subscribe({
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

  acceptRequest(requestId: number): void {
    this._doctorServices
      .acceptTratmentRequest(this.doctorId, requestId)
      .subscribe({
        next: (response) => {
          this.showSuccess("Patien's Request Accepted Sucessfuly");
          this.getPendingRequests();
        },
        error: (err) => {
          this.showError("Couldn't Accept Patient's Request");
          console.log(err);
        },
      });
  }

  rejectRequest(requestId: number): void {
    this._doctorServices
      .rejectTreatmentRequest(this.doctorId, requestId)
      .subscribe({
        next: (response) => {
          this.showSuccess("Patien's Request Rejected Sucessfuly");
          this.getPendingRequests();
        },
        error: (err) => {
          this.showError("Couldn't Reject Patient's Request");
          console.log(err);
        },
      });
  }

  viewDetails(index: number): void {
    this.requestDetails = this.requests[index];
    this.chronicDiseases =
      this.requestDetails.patientInfo.patientMedical.chronicDisease.split(',');
  }

  // loadPending():void{

  // }

  // loadAccepted():void{

  // }

  // loadRemoved():void{

  // }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }
  showError(message: string): void {
    this.toastr.error(message);
  }
}

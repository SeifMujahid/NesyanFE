import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { RouterLink } from '@angular/router';
import { TreatmentRequests } from 'src/app/core/interfaces/treatment-requests';
import { MainService } from 'src/app/context/main.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-patients-list',
  standalone: true,
  imports: [CommonModule, MainNavComponent, RouterLink],
  templateUrl: './manage-patients-list.component.html',
  styleUrls: ['./manage-patients-list.component.scss'],
})
export class ManagePatientsListComponent {
  requests: any[] = [];
  doctorId: number = 0;

  constructor(
    private _mainService: MainService,
    private _doctorServices: DoctorService,
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((doctorId) => {
      this.doctorId = Number(doctorId);
      // this.getSelectedPatients();
      this.getDoctorPatients();
    });
  }

  getSelectedPatients(): void {
    this._doctorServices.getSelectedTreatmentRequests(this.doctorId).subscribe({
      next: (response) => {
        this.requests = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDoctorPatients(): void {
    this._doctorServices.getDoctorPatients2(this.doctorId).subscribe({
      next: (response) => {
        this.requests = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removePatients(requestId: number): void {
    this._doctorServices
      .rejectTreatmentRequest(this.doctorId, requestId)
      .subscribe({
        next: (response) => {
          this.showSuccess(
            "Patient's Relative Notified ,If Not Accept Removement Within One Week Will Removed Automaticly.",
          );
          this.getSelectedPatients();
        },
        error: (err) => {
          this.showError("Couldn't Remove Patient");
          console.log(err);
        },
      });
  }

  removePatients2(patientId: number): void {
    this._doctorServices
      .removeDoctorPatient2(this.doctorId, patientId)
      .subscribe({
        next: (response) => {
          this.showSuccess('Patient Removed Sucessfuly');
          this.getDoctorPatients();
        },
        error: (err) => {
          this.showError("Couldn't Remove Patient");
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

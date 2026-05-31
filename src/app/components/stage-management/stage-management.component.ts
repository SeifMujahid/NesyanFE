import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { MainService } from 'src/app/context/main.service';
import { DoctorPatientsList } from 'src/app/core/interfaces/patients';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stage-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stage-management.component.html',
  styleUrls: ['./stage-management.component.scss'],
})
export class StageManagementComponent implements OnInit {
  doctorId: number = 0;
  patientId: number = 0;
  patientData: DoctorPatientsList = {} as DoctorPatientsList;

  constructor(
    private _doctorService: DoctorService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((doctorId) => {
      this.doctorId = Number(doctorId);
    });
    this._mainService.currentPatientID.subscribe((patientId) => {
      this.patientId = Number(patientId);
      this.getPatientSummery();
    });
  }

  getPatientSummery(): void {
    this._doctorService
      .getPatientSummery(this.doctorId, this.patientId)
      .subscribe({
        next: (response) => {
          this.patientData = response.patientSummary;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  updatePatientStage(newStage: number): void {
    this._doctorService
      .updatePatientStage(this.doctorId, this.patientId, newStage)
      .subscribe({
        next: (response) => {
          this.getPatientSummery();
          this.showSuccess(response);
          window.location.reload();
        },
        error: (err) => {
          console.log(err);
          this.showError('Failed to update patient stage.');
        },
      });
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }
  showError(message: string) {
    this.toastr.error(message);
  }
}

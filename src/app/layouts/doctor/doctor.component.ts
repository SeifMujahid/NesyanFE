import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MainNavComponent } from 'src/app/components/main-nav/main-nav.component';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { MainService } from 'src/app/context/main.service';
import { DoctorPatientsList } from 'src/app/core/interfaces/patients';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MainNavComponent,
  ],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent implements OnInit {
  doctorPatientsList: DoctorPatientsList[] = [];
  patientDetails: DoctorPatientsList = {} as DoctorPatientsList;
  doctorID: string = '';
  activeIndex: number = 0;

  constructor(
    private _doctorService: DoctorService,
    private _mainService: MainService,
  ) {}

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((userID) => {
      this.doctorID = userID;
      this.getDoctorPatientsList();
    });
  }

  getDoctorPatientsList() {
    this._doctorService.getDoctorPatients(Number(this.doctorID)).subscribe({
      next: (response) => {
        this.doctorPatientsList = response.patients;
        this.patientDetails = this.doctorPatientsList[0];
        this._mainService.setCurrentPatientID(
          this.doctorPatientsList[0].patientId.toString(),
        );
      },
      error: (err) => {
        console.error('Error fetching doctor patients:', err);
      },
    });
  }

  selectPatient(patientID: number, index: number) {
    this._mainService.setCurrentPatientID(patientID.toString());
    this.activeIndex = index;
    this.patientDetails = this.doctorPatientsList[index];
  }
}

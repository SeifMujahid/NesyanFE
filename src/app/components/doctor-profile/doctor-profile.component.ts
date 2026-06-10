import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { DoctorProfile } from 'src/app/core/interfaces/doctor';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { MainService } from 'src/app/context/main.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, MainNavComponent, RouterLink],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.scss'],
})
export class DoctorProfileComponent implements OnInit {
  doctorId: number = 0;
  doctorProfile: DoctorProfile = {} as DoctorProfile;

  constructor(
    private _doctorService: DoctorService,
    private _mainService: MainService,
  ) {}

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((doctorID) => {
      this.doctorId = Number(doctorID);
      this.getDoctorProfile();
    });
  }

  getDoctorProfile(): void {
    this._doctorService.getDoctorProfile(this.doctorId).subscribe({
      next: (response) => {
        this.doctorProfile = response;
      },
      error: (err) => console.error(err),
    });
  }
}

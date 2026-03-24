import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-doctor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-doctor.component.html',
  styleUrls: ['./home-doctor.component.css'],
})
export class HomeDoctorComponent {}

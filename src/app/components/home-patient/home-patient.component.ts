import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-patient',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-patient.component.html',
  styleUrls: ['./home-patient.component.css'],
})
export class HomePatientComponent {}

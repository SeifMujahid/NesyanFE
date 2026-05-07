import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent {}

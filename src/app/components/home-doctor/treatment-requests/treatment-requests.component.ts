import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-treatment-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './treatment-requests.component.html',
  styleUrls: ['./treatment-requests.component.css'],
})
export class TreatmentRequestsComponent {}

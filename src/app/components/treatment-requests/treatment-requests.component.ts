import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-treatment-requests',
  standalone: true,
  imports: [CommonModule, MainNavComponent,RouterLink],
  templateUrl: './treatment-requests.component.html',
  styleUrls: ['./treatment-requests.component.scss'],
})
export class TreatmentRequestsComponent {}

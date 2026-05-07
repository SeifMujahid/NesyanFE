import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-caregive',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './caregive.component.html',
  styleUrls: ['./caregive.component.scss'],
})
export class CaregiveComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from 'src/app/components/main-nav/main-nav.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-caregive',
  standalone: true,
  imports: [CommonModule, MainNavComponent, RouterLink],
  templateUrl: './caregive.component.html',
  styleUrls: ['./caregive.component.scss'],
})
export class CaregiveComponent {}

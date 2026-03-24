import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-relative',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-relative.component.html',
  styleUrls: ['./home-relative.component.css'],
})
export class HomeRelativeComponent {}

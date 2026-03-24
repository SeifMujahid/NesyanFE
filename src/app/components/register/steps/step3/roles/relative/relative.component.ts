import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relative',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.css'],
})
export class RelativeComponent {}

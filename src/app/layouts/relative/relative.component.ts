import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-relative',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.scss'],
})
export class RelativeComponent {}

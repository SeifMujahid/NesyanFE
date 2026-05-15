import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-spare-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './spare-nav.component.html',
  styleUrls: ['./spare-nav.component.scss'],
})
export class SpareNavComponent {}

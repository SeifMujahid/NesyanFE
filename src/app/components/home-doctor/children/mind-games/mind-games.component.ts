import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mind-games',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mind-games.component.html',
  styleUrls: ['./mind-games.component.css'],
})
export class MindGamesComponent {}

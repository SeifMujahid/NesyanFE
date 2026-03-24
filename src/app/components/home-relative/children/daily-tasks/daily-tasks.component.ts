import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-tasks.component.html',
  styleUrls: ['./daily-tasks.component.css'],
})
export class DailyTasksComponent {}

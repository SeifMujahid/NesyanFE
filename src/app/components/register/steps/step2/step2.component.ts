import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css'],
})
export class Step2Component {
  constructor(private _Router: Router) {}

  nextBtn: any = document.querySelector('.next');

  NextNavigate(): void {
    const selectedRole = document.querySelector<HTMLInputElement>(
      'input[name="role"]:checked',
    );

    if (selectedRole?.value == 'patient') {
      this._Router.navigate(['/register/step3/patient']);
    } else if (selectedRole?.value == 'doctor') {
      this._Router.navigate(['/register/step3/doctor']);
    } else if (selectedRole?.value == 'relative') {
      this._Router.navigate(['/register/step3/relative']);
    }
  }
}

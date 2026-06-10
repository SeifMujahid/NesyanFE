import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MainService } from 'src/app/context/main.service';

@Component({
  selector: 'app-main-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
  constructor(
    private _router: Router,
    private _mainService: MainService,
  ) {}
  userName: string = '';
  userRole: string = '';

  ngOnInit(): void {
    this._mainService.currentUserName.subscribe((name) => {
      this.userName = name;
    });
    this._mainService.currentRole.subscribe((role) => {
      this.userRole = role;
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this._mainService.clearUserData();
    this._router.navigate(['']);
  }

  profile(): void {
    if (this.userRole.toLocaleLowerCase() === 'patient') {
      this._router.navigate(['/patient/my-profile']);
    } else if (this.userRole.toLocaleLowerCase() === 'doctor') {
      this._router.navigate(['/doctor/my-profile']);
    } else if (this.userRole.toLocaleLowerCase() === 'relative') {
      this._router.navigate(['/relative/my-profile']);
    } else if (this.userRole.toLocaleLowerCase() === 'caregiver') {
      this._router.navigate(['/caregiver/my-profile']);
    }
  }
}

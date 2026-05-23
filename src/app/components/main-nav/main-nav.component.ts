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

  ngOnInit(): void {
    this._mainService.currentUserName.subscribe((name) => {
      this.userName = name;
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this._mainService.clearUserData();
    this._router.navigate(['']);
  }
}

import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MainService } from 'src/app/context/main.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VerifayAccountInterface } from 'src/app/core/interfaces/verifay-account-interface';

@Component({
  selector: 'app-verifay-account',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './verifay-account.component.html',
  styleUrls: ['./verifay-account.component.scss'],
})
export class VerifayAccountComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _mainService: MainService,
    private _router: Router,
  ) {}
  registeredEmail: string = '';
  verifayData: VerifayAccountInterface = {} as VerifayAccountInterface;
  ngOnInit(): void {
    this._mainService.registeredEmail.subscribe({
      next: (email) => {
        this.verifay.patchValue({ email: email });
      },
    });
  }

  verifay: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    code: new FormControl(null, [Validators.required]),
  });

  verifayAccount(): void {
    if (this.verifay.valid) {
      this.verifayData.email = this.verifay.value.email;
      this.verifayData.code = this.verifay.value.code;
      this._authService.verifyAccount(this.verifayData).subscribe({
        next: (response) => {
          console.log('Account verifayed successfully:', response);
          this._router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Error verifaying account:', err);
        },
      });
    }
  }
}

import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verifay-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verifay-account.component.html',
  styleUrls: ['./verifay-account.component.scss'],
})
export class VerifayAccountComponent implements OnInit, OnDestroy {
  constructor(
    private _authService: AuthService,
    private _mainService: MainService,
    private _router: Router,
  ) {}
  toastr = inject(ToastrService);

  resendDisabled = false;
  resendCountdown = 0;
  countdownInterval: any;
  tempEmail: string = '';
  verifayData: VerifayAccountInterface = {} as VerifayAccountInterface;

  ngOnInit(): void {
    this._mainService.tempEmail.subscribe({
      next: (email) => {
        this.verifay.patchValue({ email: email });
        this.tempEmail = email;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
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
          this.showSuccess(response.message);
          this._router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Error verifaying account:', err);
          this.showError(err.error.message);
        },
      });
    }
  }

  resendCode(): void {
    if (this.resendDisabled) return;

    this._authService.reVerifyEmail({ email: this.tempEmail }).subscribe({
      next: (response) => {
        console.log('Resend code request successful:', response);
        this.showSuccess(response.message);
        this.startCooldown();
      },
      error: (err) => {
        console.error('Resend code request failed:', err);
        this.showError(err.error.message);
      },
    });
  }

  startCooldown(): void {
    this.resendDisabled = true;
    this.resendCountdown = 300;

    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;

      if (this.resendCountdown <= 0) {
        this.resendDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  getCountdownText(): string {
    const minutes = Math.floor(this.resendCountdown / 60);
    const seconds = this.resendCountdown % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }
  showError(message: string) {
    this.toastr.error(message);
  }
}

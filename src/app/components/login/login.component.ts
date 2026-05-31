import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginInterface } from 'src/app/core/interfaces/login-interface';
import { MainService } from 'src/app/context/main.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ForgetPasswordInterface } from 'src/app/core/interfaces/forget-password-interface';
import { VerifayAccountInterface } from 'src/app/core/interfaces/verifay-account-interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isRememberMeChecked: boolean = false;
  loginData: LoginInterface = {} as LoginInterface;
  forgetPasswordData: ForgetPasswordInterface = {} as ForgetPasswordInterface;
  verifyAccountData: ForgetPasswordInterface = {} as ForgetPasswordInterface;
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _mainService: MainService,
  ) {}
  toastr = inject(ToastrService);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    ]),
  });

  login(): void {
    if (this.loginForm.valid) {
      this.loginData = this.loginForm.value;
      this._authService.login(this.loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.showSuccess(response.message);
          if (this.isRememberMeChecked) {
            localStorage.setItem('token', response.token);
            sessionStorage.removeItem('token');
          } else {
            sessionStorage.setItem('token', response.token);
            localStorage.removeItem('token');
          }
          this._mainService.setCurrentRole(response.role);
          this._mainService.setCurrentUserId(response.userId);
          this._mainService.setCurrentUserName(response.userName);
          this._mainService.setlogedEmail(this.loginData.email);
          this.routeToRoleHome(response.role);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.showError(err.error.message);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.showError('Please fill in the form correctly before submitting.');
    }
  }

  routeToRoleHome(role: string): void {
    switch (role.toLocaleLowerCase()) {
      case 'patient':
        this._router.navigate(['/patient']);
        break;
      case 'doctor':
        this._router.navigate(['/doctor']);
        break;
      case 'relative':
        this._router.navigate(['/relative']);
        break;
      case 'caregiver':
        this._router.navigate(['/caregiver']);
        break;
      default:
        console.error('Unknown role:', role);
    }
  }

  forgetPassword(): void {
    if (this.loginForm.get('email')?.value) {
      this.forgetPasswordData.email = this.loginForm.get('email')?.value;
      this._mainService.setTempEmail(this.forgetPasswordData.email);
      this._authService.forgetPassword(this.forgetPasswordData).subscribe({
        next: (response) => {
          console.log('Forget password request successful:', response);
          this.showSuccess(response.message);
          this._router.navigate(['/auth/reset-password']);
        },
        error: (err) => {
          console.error('Forget password request failed:', err);
          this.showError(err.error.message);
        },
      });
    }
  }

  verifyEmail(): void {
    if (this.loginForm.get('email')?.value) {
      this.verifyAccountData.email = this.loginForm.get('email')?.value;
      this._mainService.setTempEmail(this.verifyAccountData.email);
      this._authService.reVerifyEmail(this.verifyAccountData).subscribe({
        next: (response) => {
          console.log('Verify account request successful:', response);
          this.showSuccess(response.message);
          this._router.navigate(['/auth/verifay-account']);
        },
        error: (err) => {
          console.error('Verify account request failed:', err);
          this.showError(err.error.message);
        },
      });
    }
  }

  onRemeberMeChange(event: any): void {
    if (event.target.checked) {
      this.isRememberMeChecked = true;
    } else {
      this.isRememberMeChecked = false;
    }
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }
  showError(message: string) {
    this.toastr.error(message);
  }
}

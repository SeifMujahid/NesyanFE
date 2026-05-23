import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MainService } from 'src/app/context/main.service';

export const relativeAuthGuardGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _mainService = inject(MainService);

  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.role.toLowerCase() !== 'relative') {
        console.log('User role is not relative, access denied');
        _router.navigate([`/${decodedToken.role.toLowerCase()}`]);
        return false;
      }
      // Store decoded token data in MainService
      _mainService.setCurrentUserName(decodedToken.unique_name);
      _mainService.setCurrentUserId(decodedToken.nameid);
      _mainService.setCurrentRole(decodedToken.role.toLowerCase());
      _mainService.setlogedEmail(decodedToken.email);

      console.log('Token decoded successfully');
      console.log('Username:', decodedToken.unique_name);
      console.log('User ID:', decodedToken.nameid);
      console.log('Role:', decodedToken.role.toLowerCase());
      console.log('Email:', decodedToken.email);

      return true;
    } catch (error) {
      console.log('Error decoding token:', error);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      _router.navigate(['']);
      return false;
    }
  } else {
    console.log('No token found in localStorage or sessionSrorage');
    _router.navigate(['']);
    return false;
  }
};

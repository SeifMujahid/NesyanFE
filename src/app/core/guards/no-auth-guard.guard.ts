import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MainService } from 'src/app/context/main.service';
import { jwtDecode } from 'jwt-decode';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _mainService = inject(MainService);

  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);

      // Store user data in MainService
      _mainService.setCurrentUserName(decodedToken.unique_name);
      _mainService.setCurrentUserId(decodedToken.nameid);
      _mainService.setCurrentRole(decodedToken.role.toLowerCase());
      _mainService.setlogedEmail(decodedToken.email);

      // Redirect to role-based home
      routeToRoleHome(decodedToken.role.toLowerCase(), _router);
      return false; // Block access to landing page
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return true; // Allow access to landing page if token is invalid
    }
  }

  // No token found, allow access to landing page
  return true;
};

function routeToRoleHome(role: string, router: Router): void {
  const roleMap: { [key: string]: string } = {
    patient: '/patient',
    doctor: '/doctor',
    relative: '/relative',
    caregiver: '/caregiver',
  };

  const path = roleMap[role.toLowerCase()];
  if (path) {
    router.navigate([path]);
  } else {
    console.error('Unknown role:', role);
  }
}

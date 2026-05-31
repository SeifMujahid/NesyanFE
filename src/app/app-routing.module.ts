import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuardGuard } from './core/guards/auth-guard.guard';
import { noAuthGuard } from './core/guards/no-auth-guard.guard';
import { caregiveAuthGuardGuard } from './core/guards/caregive-auth-guard.guard';
import { patientAuthGuardGuard } from './core/guards/patient-auth-guard.guard';
import { doctorAuthGuardGuard } from './core/guards/doctor-auth-guard.guard';
import { relativeAuthGuardGuard } from './core/guards/relative-auth-guard.guard';

const routes: Routes = [
  // Landing routing - Protected from authenticated users
  {
    path: '',
    redirectTo: 'nesyan',
    pathMatch: 'full',
  },
  {
    path: 'nesyan',
    canActivate: [noAuthGuard], // Redirect to home if authenticated
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        (m) => m.LandingComponent,
      ),
    title: 'Nesyan',
  },

  // Authentication routing
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/authentication/authentication.component').then(
        (m) => m.AuthenticationComponent,
      ),
    title: 'Nesyan',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (m) => m.LoginComponent,
          ),
        title: 'Nesyan|Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
        title: 'Nesyan|Register',
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./components/forget-password/forget-password.component').then(
            (m) => m.ForgetPasswordComponent,
          ),
        title: 'Nesyan|Forget Password',
      },
      {
        path: 'verifay-account',
        loadComponent: () =>
          import('./components/verifay-account/verifay-account.component').then(
            (m) => m.VerifayAccountComponent,
          ),
        title: 'Nesyan|Verify Account',
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./components/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent,
          ),
        title: 'Nesyan|Reset Password',
      },
    ],
  },

  // Caregiver routing
  {
    canActivate: [caregiveAuthGuardGuard],
    path: 'caregiver',
    loadComponent: () =>
      import('./layouts/caregive/caregive.component').then(
        (m) => m.CaregiveComponent,
      ),
    title: 'Nesyan|Caregiver',
  },
  {
    canActivate: [caregiveAuthGuardGuard],
    path: 'caregiver/my-profile',
    loadComponent: () =>
      import('./components/caregiver-profile/caregiver-profile.component').then(
        (m) => m.CaregiverProfileComponent,
      ),
    title: 'Nesyan|Caregiver Profile',
  },

  // Patient routing
  {
    canActivate: [patientAuthGuardGuard],
    path: 'patient',
    loadComponent: () =>
      import('./layouts/patient/patient.component').then(
        (m) => m.PatientComponent,
      ),
    title: 'Nesyan|Patient',
  },
  {
    canActivate: [patientAuthGuardGuard],
    path: 'patient/my-profile',
    loadComponent: () =>
      import('./components/patient-profile/patient-profile.component').then(
        (m) => m.PatientProfileComponent,
      ),
    title: 'Nesyan|Patient Profile',
  },

  // Doctor routing
  {
    canActivate: [doctorAuthGuardGuard],
    path: 'doctor',
    loadComponent: () =>
      import('./layouts/doctor/doctor.component').then(
        (m) => m.DoctorComponent,
      ),
    title: 'Nesyan|Doctor',
    children: [
      { path: '', redirectTo: 'medication', pathMatch: 'full' },
      {
        path: 'medication',
        loadComponent: () =>
          import('./components/medication/medication.component').then(
            (m) => m.MedicationComponent,
          ),
        title: 'Nesyan|Medication',
      },
      {
        path: 'stage-management',
        loadComponent: () =>
          import('./components/stage-management/stage-management.component').then(
            (m) => m.StageManagementComponent,
          ),
        title: 'Nesyan|Stage Management',
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./components/statistics/statistics.component').then(
            (m) => m.StatisticsComponent,
          ),
        title: 'Nesyan|Statistics',
      },
      {
        path: 'mind-games',
        loadComponent: () =>
          import('./components/mind-games/mind-games.component').then(
            (m) => m.MindGamesComponent,
          ),
        title: 'Nesyan|Mind Games',
      },
    ],
  },
  {
    canActivate: [doctorAuthGuardGuard],
    path: 'doctor/my-profile',
    loadComponent: () =>
      import('./components/doctor-profile/doctor-profile.component').then(
        (m) => m.DoctorProfileComponent,
      ),
    title: 'Nesyan|Doctor Profile',
  },
  {
    canActivate: [doctorAuthGuardGuard],
    path: 'doctor/patient-profile',
    loadComponent: () =>
      import('./components/patient-profile/patient-profile.component').then(
        (m) => m.PatientProfileComponent,
      ),
    title: 'Nesyan|Patient Profile',
  },
  {
    canActivate: [doctorAuthGuardGuard],
    path: 'doctor/treatment-requests',
    loadComponent: () =>
      import('./components/treatment-requests/treatment-requests.component').then(
        (m) => m.TreatmentRequestsComponent,
      ),
    title: 'Nesyan|Treatment Requests',
  },
  {
    canActivate: [doctorAuthGuardGuard],
    path: 'doctor/manage-patients',
    loadComponent: () =>
      import('./components/manage-patients-list/manage-patients-list.component').then(
        (m) => m.ManagePatientsListComponent,
      ),
    title: 'Nesyan|Manage Patients',
  },

  // Relative routing
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative',
    loadComponent: () =>
      import('./layouts/relative/relative.component').then(
        (m) => m.RelativeComponent,
      ),
    title: 'Nesyan|Relative',
    children: [
      { path: '', redirectTo: 'routine', pathMatch: 'full' },
      {
        path: 'routine',
        loadComponent: () =>
          import('./components/routine/routine.component').then(
            (m) => m.RoutineComponent,
          ),
        title: 'Nesyan|Routine',
      },
      // {
      //   path: 'reminders',
      //   loadComponent: () =>
      //     import('./components/reminders/reminders.component').then(
      //       (m) => m.RemindersComponent,
      //     ),
      //   title: 'Nesyan|Reminders',
      // },
      // {
      //   path: 'daily-tasks',
      //   loadComponent: () =>
      //     import('./components/daily-tasks/daily-tasks.component').then(
      //       (m) => m.DailyTasksComponent,
      //     ),
      //   title: 'Nesyan|Daily Tasks',
      // },
      {
        path: 'medication',
        loadComponent: () =>
          import('./components/medication-relative/medication-relative.component').then(
            (m) => m.MedicationRelativeComponent,
          ),
        title: 'Nesyan|Medication',
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./components/appointments/appointments.component').then(
            (m) => m.AppointmentsComponent,
          ),
        title: 'Nesyan|Appointments',
      },
      {
        path: 'family',
        loadComponent: () =>
          import('./components/family/family.component').then(
            (m) => m.FamilyComponent,
          ),
        title: 'Nesyan|Family',
      },
      {
        path: 'location',
        loadComponent: () =>
          import('./components/location/location.component').then(
            (m) => m.LocationComponent,
          ),
        title: 'Nesyan|Location',
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./components/statistics/statistics.component').then(
            (m) => m.StatisticsComponent,
          ),
        title: 'Nesyan|Statistics',
      },
    ],
  },
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative/my-profile',
    loadComponent: () =>
      import('./components/relative-profile/relative-profile.component').then(
        (m) => m.RelativeProfileComponent,
      ),
    title: 'Nesyan|Relative Profile',
  },
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative/patient-profile',
    loadComponent: () =>
      import('./components/patient-profile/patient-profile.component').then(
        (m) => m.PatientProfileComponent,
      ),
    title: 'Nesyan|Patient Profile',
  },
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative/manage-patients',
    loadComponent: () =>
      import('./components/manage-patients-list/manage-patients-list.component').then(
        (m) => m.ManagePatientsListComponent,
      ),
    title: 'Nesyan|Manage Patients',
  },
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative/request-treatment',
    loadComponent: () =>
      import('./components/request-treatment/request-treatment.component').then(
        (m) => m.RequestTreatmentComponent,
      ),
    title: 'Nesyan|Request Treatment',
  },
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative/request-caregiver',
    loadComponent: () =>
      import('./components/request-caregiver/request-caregiver.component').then(
        (m) => m.RequestCaregiverComponent,
      ),
    title: 'Nesyan|Request Caregiver',
  },
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative/create-patient-account',
    loadComponent: () =>
      import('./components/create-patient-account/create-patient-account.component').then(
        (m) => m.CreatePatientAccountComponent,
      ),
    title: 'Nesyan|Create Patient Account',
  },
  {
    canActivate: [relativeAuthGuardGuard],
    path: 'relative/link-patient-account',
    loadComponent: () =>
      import('./components/link-patient-account/link-patient-account.component').then(
        (m) => m.LinkPatientAccountComponent,
      ),
    title: 'Nesyan|Link Patient Account',
  },

  // Wildcard route - must be last
  { path: '**', redirectTo: 'nesyan', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

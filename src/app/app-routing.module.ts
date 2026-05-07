import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //landing routing
  { path: '', redirectTo: 'nesyan', pathMatch: 'full' },
  {
    path: 'nesyan',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        (m) => m.LandingComponent,
      ),
    title: 'Nesyan',
  },
  //authentication routing
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
        title: 'Nesyan Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
        title: 'Nesyan Register',
      },
    ],
  },
  //caregiver routing
  {
    path: 'caregiver',
    loadComponent: () =>
      import('./layouts/caregive/caregive.component').then(
        (m) => m.CaregiveComponent,
      ),
    title: 'Nesyan Caregiver',
    children: [
      {
        path: 'my-profile',
        loadComponent: () =>
          import('./components/caregiver-profile/caregiver-profile.component').then(
            (m) => m.CaregiverProfileComponent,
          ),
        title: 'Nesyan|Caregiver Profile',
      },
    ],
  },
  //patient routing
  {
    path: 'patient',
    loadComponent: () =>
      import('./layouts/patient/patient.component').then(
        (m) => m.PatientComponent,
      ),
    title: 'Nesyan Patient',
    children: [
      {
        path: 'my-profile',
        loadComponent: () =>
          import('./components/patient-profile/patient-profile.component').then(
            (m) => m.PatientProfileComponent,
          ),
        title: 'Nesyan|Patient Profile',
      },
    ],
  },
  //doctor routing
  {
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
    path: 'doctor/my-profile',
    loadComponent: () =>
      import('./components/doctor-profile/doctor-profile.component').then(
        (m) => m.DoctorProfileComponent,
      ),
    title: 'Nesyan|Doctor Profile',
  },
  {
    path: 'doctor/patient-profile',
    loadComponent: () =>
      import('./components/patient-profile/patient-profile.component').then(
        (m) => m.PatientProfileComponent,
      ),
    title: 'Nesyan|Patient Profile',
  },
  {
    path: 'doctor/treatment-requests',
    loadComponent: () =>
      import('./components/treatment-requests/treatment-requests.component').then(
        (m) => m.TreatmentRequestsComponent,
      ),
    title: 'Nesyan|Treatment Requests',
  },
  {
    path: 'doctor/manage-patients',
    loadComponent: () =>
      import('./components/manage-patients-list/manage-patients-list.component').then(
        (m) => m.ManagePatientsListComponent,
      ),
    title: 'Nesyan|Manage Patients',
  },
  //relative routing
  {
    path: 'relative',
    loadComponent: () =>
      import('./layouts/relative/relative.component').then(
        (m) => m.RelativeComponent,
      ),
    title: 'Nesyan|Relative',
    children: [
      { path: '', redirectTo: 'reminders', pathMatch: 'full' },
      {
        path: 'reminders',
        loadComponent: () =>
          import('./components/reminders/reminders.component').then(
            (m) => m.RemindersComponent,
          ),
        title: 'Nesyan|Reminders',
      },
      {
        path: 'daily-tasks',
        loadComponent: () =>
          import('./components/daily-tasks/daily-tasks.component').then(
            (m) => m.DailyTasksComponent,
          ),
        title: 'Nesyan|Daily Tasks',
      },
      {
        path: 'medication',
        loadComponent: () =>
          import('./components/medication/medication.component').then(
            (m) => m.MedicationComponent,
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
    path: 'relative/my-profile',
    loadComponent: () =>
      import('./components/relative-profile/relative-profile.component').then(
        (m) => m.RelativeProfileComponent,
      ),
    title: 'Nesyan|Relative Profile',
  },
  {
    path: 'relative/patient-profile',
    loadComponent: () =>
      import('./components/patient-profile/patient-profile.component').then(
        (m) => m.PatientProfileComponent,
      ),
    title: 'Nesyan|Patient Profile',
  },
  {
    path: 'relative/manage-patients',
    loadComponent: () =>
      import('./components/manage-patients-list/manage-patients-list.component').then(
        (m) => m.ManagePatientsListComponent,
      ),
    title: 'Nesyan|Manage Patients',
  },
  {
    path: 'relative/request-treatment',
    loadComponent: () =>
      import('./components/request-treatment/request-treatment.component').then(
        (m) => m.RequestTreatmentComponent,
      ),
    title: 'Nesyan|Request Treatment',
  },
  {
    path: 'relative/request-caregiver',
    loadComponent: () =>
      import('./components/request-caregiver/request-caregiver.component').then(
        (m) => m.RequestCaregiverComponent,
      ),
    title: 'Nesyan|Request Caregiver',
  },
  {
    path: 'relative/create-patient-account',
    loadComponent: () =>
      import('./components/create-patient-account/create-patient-account.component').then(
        (m) => m.CreatePatientAccountComponent,
      ),
    title: 'Nesyan|Create Patient Account',
  },
  {
    path: 'relative/link-patient-account',
    loadComponent: () =>
      import('./components/link-patient-account/link-patient-account.component').then(
        (m) => m.LinkPatientAccountComponent,
      ),
    title: 'Nesyan|Link Patient Account',
  },
  //rubbish routing
  { path: '**', redirectTo: 'nesyan', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

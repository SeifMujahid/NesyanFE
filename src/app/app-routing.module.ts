import { RemindersComponent } from './components/home-relative/children/reminders/reminders.component';
import { MedicationComponent } from './components/home-doctor/children/medication/medication.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //guard before authentication goes here
  { path: '', redirectTo: '/nesyan', pathMatch: 'full' },
  {
    path: 'nesyan',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        (m) => m.LandingComponent,
      ),
    title: 'Nesyan',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
    title: 'Register',
    children: [
      { path: '', redirectTo: '/register/step1', pathMatch: 'full' },
      {
        path: 'step1',
        loadComponent: () =>
          import('./components/register/steps/step1/step1.component').then(
            (m) => m.Step1Component,
          ),
        title: 'Step1',
      },
      {
        path: 'step2',
        loadComponent: () =>
          import('./components/register/steps/step2/step2.component').then(
            (m) => m.Step2Component,
          ),
        title: 'Step2',
      },
      {
        path: 'step3',
        loadComponent: () =>
          import('./components/register/steps/step3/step3.component').then(
            (m) => m.Step3Component,
          ),
        title: 'Step3',
        children: [
          { path: '', redirectTo: '/register/step2', pathMatch: 'full' },
          {
            path: 'patient',
            loadComponent: () =>
              import('./components/register/steps/step3/roles/patient/patient.component').then(
                (m) => m.PatientComponent,
              ),
            title: 'Patient',
          },
          {
            path: 'doctor',
            loadComponent: () =>
              import('./components/register/steps/step3/roles/doctor/doctor.component').then(
                (m) => m.DoctorComponent,
              ),
            title: 'Doctor',
          },
          {
            path: 'relative',
            loadComponent: () =>
              import('./components/register/steps/step3/roles/relative/relative.component').then(
                (m) => m.RelativeComponent,
              ),
            title: 'Relative',
          },
        ],
      },
    ],
  },
  //guard if already authenticated goes here
  {
    path: 'home-patient',
    loadComponent: () =>
      import('./components/home-patient/home-patient.component').then(
        (m) => m.HomePatientComponent,
      ),
    title: 'Home Patient',
  },
  {
    path: 'home-doctor',
    loadComponent: () =>
      import('./components/home-doctor/home-doctor.component').then(
        (m) => m.HomeDoctorComponent,
      ),
    title: 'Home Doctor',
    children: [
      { path: '', redirectTo: '/home-doctor/medication', pathMatch: 'full' },
      {
        path: 'medication',
        loadComponent: () =>
          import('./components/home-doctor/children/medication/medication.component').then(
            (m) => m.MedicationComponent,
          ),
        title: 'Medication',
      },
      {
        path: 'stage-management',
        loadComponent: () =>
          import('./components/home-doctor/children/stage-management/stage-management.component').then(
            (m) => m.StageManagementComponent,
          ),
        title: 'Stage Management',
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./components/home-doctor/children/statistics/statistics.component').then(
            (m) => m.StatisticsComponent,
          ),
        title: 'Statistics',
      },
      {
        path: 'mind-games',
        loadComponent: () =>
          import('./components/home-doctor/children/mind-games/mind-games.component').then(
            (m) => m.MindGamesComponent,
          ),
        title: 'Mind Games',
      },
    ],
  },
  {
    path: 'home-doctor/treatment-requests',
    loadComponent: () =>
      import('./components/home-doctor/treatment-requests/treatment-requests.component').then(
        (m) => m.TreatmentRequestsComponent,
      ),
    title: 'Treatment Requests',
  },
  {
    path: 'home-relative',
    loadComponent: () =>
      import('./components/home-relative/home-relative.component').then(
        (m) => m.HomeRelativeComponent,
      ),
    title: 'Home Relative',
    children: [
      { path: '', redirectTo: '/home-relative/reminders', pathMatch: 'full' },
      {
        path: 'reminders',
        loadComponent: () =>
          import('./components/home-relative/children/reminders/reminders.component').then(
            (m) => m.RemindersComponent,
          ),
        title: 'Reminders',
      },
      {
        path: 'daily-tasks',
        loadComponent: () =>
          import('./components/home-relative/children/daily-tasks/daily-tasks.component').then(
            (m) => m.DailyTasksComponent,
          ),
        title: 'Daily Tasks',
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./components/home-relative/children/appointments/appointments.component').then(
            (m) => m.AppointmentsComponent,
          ),
        title: 'Appointments',
      },
      {
        path: 'medication',
        loadComponent: () =>
          import('./components/home-relative/children/medication/medication.component').then(
            (m) => m.MedicationComponent,
          ),
        title: 'Medication',
      },
      {
        path: 'family',
        loadComponent: () =>
          import('./components/home-relative/children/family/family.component').then(
            (m) => m.FamilyComponent,
          ),
        title: 'Family',
      },
      {
        path: 'location',
        loadComponent: () =>
          import('./components/home-relative/children/location/location.component').then(
            (m) => m.LocationComponent,
          ),
        title: 'Location',
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./components/home-relative/children/statistics/statistics.component').then(
            (m) => m.StatisticsComponent,
          ),
        title: 'Statistics',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/nesyan',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddAppointmentData,
  PatientAppointmentList,
} from 'src/app/core/interfaces/patients';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import { RelativeService } from 'src/app/core/services/relative.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  patientAppointmentsList: PatientAppointmentList[] = [];
  addAppointmentData: AddAppointmentData = {} as AddAppointmentData;
  editAppointmentData: AddAppointmentData = {} as AddAppointmentData;
  relativeId: number = 0;
  patientId: number = 0;
  appointmentIndex: number = 0;
  appointmentId: number = 0;
  onEdit: boolean = false;

  constructor(
    private _relativeService: RelativeService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  appointmentData: FormGroup = new FormGroup({
    type: new FormControl(2, [Validators.required]),
    title: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    specialty: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    frequency: new FormControl(1, [Validators.required]),
    reminderDate: new FormControl('', [Validators.required]),
    reminderTime: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((relativeId) => {
      this.relativeId = Number(relativeId);
    });
    this._mainService.currentPatientID.subscribe((patientId) => {
      this.patientId = Number(patientId);
      this.getPatientAppointmentList();
    });
  }

  getPatientAppointmentList(): void {
    this._relativeService
      .getPatientAppointment(this.relativeId, this.patientId)
      .subscribe({
        next: (response) => {
          this.patientAppointmentsList =
            response.patientAppointments.appointmentToReturn;
          console.log(
            'Load patient routine sucessfuly',
            this.patientAppointmentsList,
          );
        },
        error: (err) => {
          console.log('Faild to load patient routine', err);
        },
      });
  }

  changeToAdd() {
    this.onEdit = false;
    this.appointmentData.reset({
      type: 2,
      title: '',
      name: '',
      specialty: '',
      location: '',
      frequency: 1,
      reminderDate: '',
      reminderTime: '',
      notes: '',
    });
  }

  completeAddAppointment(): void {
    if (this.appointmentData.valid) {
      this.addAppointmentData.type = this.appointmentData.value.type;
      this.addAppointmentData.title = this.appointmentData.value.title;
      this.addAppointmentData.name = this.appointmentData.value.name;
      this.addAppointmentData.specialty = this.appointmentData.value.specialty;
      this.addAppointmentData.location = this.appointmentData.value.location;
      this.addAppointmentData.frequency = Number(
        this.appointmentData.value.frequency,
      );

      this.addAppointmentData.reminderDate =
        this.appointmentData.value.reminderDate;

      const time = this.appointmentData.value.reminderTime;
      this.addAppointmentData.reminderTime = `${time}:00`;

      this.addAppointmentData.notes = this.appointmentData.value.notes;
      this.addAppointment();
    } else {
      this.appointmentData.markAllAsTouched();
      this.showError('Please fill all required fields correctly.');
    }
  }

  addAppointment(): void {
    this._relativeService
      .addPatientAppointment(
        this.relativeId,
        this.patientId,
        this.addAppointmentData,
      )
      .subscribe({
        next: (response) => {
          console.log('Appointment added successfully:', response);
          this.getPatientAppointmentList();
          this.showSuccess('Appointment added successfully!');
          this.appointmentData.reset({
            type: 2,
            title: '',
            name: '',
            specialty: '',
            location: '',
            frequency: 1,
            reminderDate: '',
            reminderTime: '',
            notes: '',
          });
          this.onEdit = false;
        },
        error: (err) => {
          console.error('Error adding appointment:', err);
          this.showError('Failed to add appointment.');
        },
      });
  }

  deleteAppointment(appointmentId: number): void {
    this._relativeService
      .deletePatientAppointment(this.relativeId, this.patientId, appointmentId)
      .subscribe({
        next: () => {
          this.showSuccess('Appointment deleted successfully!');
          this.getPatientAppointmentList();
        },
        error: (err) => {
          console.error('Error deleting appointment:', err);
          this.showError('Failed to delete appointment.');
        },
      });
  }

  changeToEDit(appointmentId: number, index: number): void {
    this.appointmentId = appointmentId;
    const routine = this.patientAppointmentsList[index];
    this.appointmentData.patchValue(routine);
    this.onEdit = true;
  }

  completeEditAppointment(): void {
    if (this.appointmentData.valid) {
      this.editAppointmentData.type = this.appointmentData.value.type;
      this.editAppointmentData.title = this.appointmentData.value.title;
      this.editAppointmentData.name = this.appointmentData.value.name;
      this.editAppointmentData.specialty = this.appointmentData.value.specialty;
      this.editAppointmentData.location = this.appointmentData.value.location;
      this.editAppointmentData.frequency = Number(
        this.appointmentData.value.frequency,
      );

      this.editAppointmentData.reminderDate =
        this.appointmentData.value.reminderDate;

      const time = this.appointmentData.value.reminderTime; 
      this.editAppointmentData.reminderTime =
        time.length === 5 ? `${time}:00` : time;

      this.editAppointmentData.notes = this.appointmentData.value.notes;
      this.ediAppointment(this.appointmentId);
    } else {
      this.appointmentData.markAllAsTouched();
      this.showError('Please fill all required fields correctly.');
    }
  }

  ediAppointment(appointmentId: number): void {
    this._relativeService
      .editPatientAppointment(
        this.relativeId,
        this.patientId,
        appointmentId,
        this.editAppointmentData,
      )
      .subscribe({
        next: (response) => {
          console.log('Appointment edited successfully:', response);
          this.getPatientAppointmentList();
          this.showSuccess('Appointment edited successfully!');
          this.onEdit = false;
          this.appointmentData.reset({
            type: 2,
            title: '',
            name: '',
            specialty: '',
            location: '',
            frequency: 1,
            reminderDate: '',
            reminderTime: '',
            notes: '',
          });
        },
        error: (err) => {
          console.error('Error editing appointment:', err);
          this.showError('Failed to edit appointment.');
        },
      });
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }
  showError(message: string) {
    this.toastr.error(message);
  }
}

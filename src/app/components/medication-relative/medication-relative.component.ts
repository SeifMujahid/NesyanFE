import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AddMedicationData,
  PatientMedicationList,
} from 'src/app/core/interfaces/patients';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { RelativeService } from 'src/app/core/services/relative.service';

@Component({
  selector: 'app-medication-relative',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medication-relative.component.html',
  styleUrls: ['./medication-relative.component.scss'],
})
export class MedicationRelativeComponent implements OnInit {
  patientMedicationsList: PatientMedicationList[] = [];
  addMedicationData: AddMedicationData = {} as AddMedicationData;
  editMedicationData: AddMedicationData = {} as AddMedicationData;
  relativeId: number = 0;
  patientId: number = 0;
  medicationIndex: number = 0;
  medicationId: number = 0;
  onEdit: boolean = false;

  constructor(
    private _relativeService: RelativeService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  medicationData: FormGroup = new FormGroup({
    type: new FormControl(1, [Validators.required]),
    title: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    dosage: new FormControl('', [Validators.required]),
    frequency: new FormControl(1, [Validators.required, Validators.min(1)]),
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
      this.getPatientMedicationList();
    });
  }

  getPatientMedicationList(): void {
    this._relativeService
      .getPatientMedications(this.relativeId, this.patientId)
      .subscribe({
        next: (response) => {
          this.patientMedicationsList =
            response.patientMedications.patientMedications;
          console.log('Patient Medications:', this.patientMedicationsList);
        },
        error: (err) => {
          console.error('Error fetching patient medications:', err);
        },
      });
  }

  changeToAdd() {
    this.onEdit = false;
    this.medicationData.reset({
      type: 1,
      title: '',
      name: '',
      dosage: '',
      frequency: 1,
      reminderDate: '',
      reminderTime: '',
      notes: '',
    });
  }

  completeAddMedication(): void {
    if (this.medicationData.valid) {
      this.addMedicationData.type = this.medicationData.value.type;
      this.addMedicationData.title = this.medicationData.value.title;
      this.addMedicationData.name = this.medicationData.value.name;
      this.addMedicationData.dosage = this.medicationData.value.dosage;
      this.addMedicationData.frequency = Number(
        this.medicationData.value.frequency,
      );
      this.addMedicationData.reminderDate =
        this.medicationData.value.reminderDate;

      const time = this.medicationData.value.reminderTime;
      this.addMedicationData.reminderTime = `${time}:00`;

      this.addMedicationData.notes = this.medicationData.value.notes;
      this.addMedication();
    } else {
      this.medicationData.markAllAsTouched();
      this.showError('Please fill all required fields correctly.');
    }
  }

  addMedication(): void {
    this._relativeService
      .addPatientMedication(
        this.relativeId,
        this.patientId,
        this.addMedicationData,
      )
      .subscribe({
        next: (response) => {
          console.log('Medication added successfully:', response);
          this.getPatientMedicationList();
          this.showSuccess('Medication added successfully!');
          this.medicationData.reset({
            type: 1,
            title: '',
            name: '',
            dosage: '',
            frequency: 1,
            reminderDate: '',
            reminderTime: '',
            notes: '',
          });
          this.onEdit = false;
        },
        error: (err) => {
          console.error('Error adding medication:', err);
          this.showError('Failed to add medication.');
        },
      });
  }

  deleteMedication(medicationId: number): void {
    this._relativeService
      .deletePatientMedication(this.relativeId, this.patientId, medicationId)
      .subscribe({
        next: () => {
          this.showSuccess('Medication deleted successfully!');
          this.getPatientMedicationList();
        },
        error: (err) => {
          console.error('Error deleting medication:', err);
          this.showError('Failed to delete medication.');
        },
      });
  }

  changeToEDit(medicationId: number, index: number): void {
    this.medicationId = medicationId;
    const medication = this.patientMedicationsList[index];
    this.medicationData.patchValue(medication);
    this.onEdit = true;
  }

  completeEditMedication(): void {
    if (this.medicationData.valid) {
      this.editMedicationData.type = this.medicationData.value.type;
      this.editMedicationData.title = this.medicationData.value.title;
      this.editMedicationData.name = this.medicationData.value.name;
      this.editMedicationData.dosage = this.medicationData.value.dosage;
      this.editMedicationData.frequency = Number(
        this.medicationData.value.frequency,
      );
      this.editMedicationData.reminderDate =
        this.medicationData.value.reminderDate;

      const time = this.medicationData.value.reminderTime;
      this.editMedicationData.reminderTime = time.includes(':')
        ? time
        : `${time}:00:00`;

      this.editMedicationData.notes = this.medicationData.value.notes;
      this.editMedication(this.medicationId);
    } else {
      this.medicationData.markAllAsTouched();
      this.showError('Please fill all required fields correctly.');
    }
  }

  editMedication(medicationId: number): void {
    this._relativeService
      .editPatientMedication(
        this.relativeId,
        this.patientId,
        medicationId,
        this.editMedicationData,
      )
      .subscribe({
        next: (response) => {
          console.log('Medication edited successfully:', response);
          this.getPatientMedicationList();
          this.showSuccess('Medication edited successfully!');
          this.onEdit = false;
          this.medicationData.reset({
            type: 1,
            title: '',
            name: '',
            dosage: '',
            frequency: 1,
            reminderDate: '',
            reminderTime: '',
            notes: '',
          });
        },
        error: (err) => {
          console.error('Error editing medication:', err);
          this.showError('Failed to edit medication.');
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

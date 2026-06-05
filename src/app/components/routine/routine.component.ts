import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import {
  AddRoutineData,
  PatientRoutineList,
} from 'src/app/core/interfaces/patients';
import { RelativeService } from 'src/app/core/services/relative.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
})
export class RoutineComponent implements OnInit {
  patientRoutineList: PatientRoutineList[] = [];
  addRoutineData: AddRoutineData = {} as AddRoutineData;
  editRoutineData: AddRoutineData = {} as AddRoutineData;
  relativeId: number = 0;
  patientId: number = 0;
  routineIndex: number = 0;
  routineId: number = 0;
  onEdit: boolean = false;

  constructor(
    private _relativeService: RelativeService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  routineData: FormGroup = new FormGroup({
    type: new FormControl(3, [Validators.required]),
    title: new FormControl('', [Validators.required]),
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
      this.getPatientRoutineList();
    });
  }

  getPatientRoutineList(): void {
    this._relativeService
      .getPatientRoutines(this.relativeId, this.patientId)
      .subscribe({
        next: (response) => {
          this.patientRoutineList = response.patientRoutines.routineToReturn;
          console.log(
            'Load patient routine sucessfuly',
            this.patientRoutineList,
          );
        },
        error: (err) => {
          console.log('Faild to load patient routine', err);
        },
      });
  }

  changeToAdd() {
    this.onEdit = false;
    this.routineData.reset({
      type: 3,
      title: '',
      frequency: 1,
      reminderDate: '',
      reminderTime: '',
      notes: '',
    });
  }

  completeAddRoutine(): void {
    if (this.routineData.valid) {
      this.addRoutineData.type = this.routineData.value.type;
      this.addRoutineData.title = this.routineData.value.title;
      this.addRoutineData.frequency = Number(this.routineData.value.frequency);
      this.addRoutineData.reminderDate = this.routineData.value.reminderDate;

      const time = this.routineData.value.reminderTime;
      this.addRoutineData.reminderTime = `${time}:00`;

      this.addRoutineData.notes = this.routineData.value.notes;
      this.addRoutine();
    } else {
      this.routineData.markAllAsTouched();
      this.showError('Please fill all required fields correctly.');
    }
  }

  addRoutine(): void {
    this._relativeService
      .addPatientRoutine(this.relativeId, this.patientId, this.addRoutineData)
      .subscribe({
        next: (response) => {
          console.log('Routine added successfully:', response);
          this.getPatientRoutineList();
          this.showSuccess('Routine added successfully!');
          this.routineData.reset({
            type: 3,
            title: '',
            frequency: 1,
            reminderDate: '',
            reminderTime: '',
            notes: '',
          });
          this.onEdit = false;
        },
        error: (err) => {
          console.error('Error adding Routine:', err);
          this.showError('Failed to add Routine.');
        },
      });
  }

  deleteRoutine(routineId: number): void {
    this._relativeService
      .deletePatientRoutine(this.relativeId, this.patientId, routineId)
      .subscribe({
        next: () => {
          this.showSuccess('Routine deleted successfully!');
          this.getPatientRoutineList();
        },
        error: (err) => {
          console.error('Error deleting routine:', err);
          this.showError('Failed to delete routine.');
        },
      });
  }

  changeToEDit(routineId: number, index: number): void {
    this.routineId = routineId;
    const routine = this.patientRoutineList[index];
    this.routineData.patchValue(routine);
    this.onEdit = true;
  }

  completeEditRoutine(): void {
    if (this.routineData.valid) {
      this.editRoutineData.type = this.routineData.value.type;
      this.editRoutineData.title = this.routineData.value.title;
      this.editRoutineData.frequency = Number(this.routineData.value.frequency);
      this.editRoutineData.reminderDate = this.routineData.value.reminderDate;

      const time = this.routineData.value.reminderTime;
      this.editRoutineData.reminderTime = time.includes(':')
        ? time
        : `${time}:00:00`;

      this.editRoutineData.notes = this.routineData.value.notes;
      this.ediRoutine(this.routineId);
    } else {
      this.routineData.markAllAsTouched();
      this.showError('Please fill all required fields correctly.');
    }
  }

  ediRoutine(routineId: number): void {
    this._relativeService
      .editPatientRoutine(
        this.relativeId,
        this.patientId,
        routineId,
        this.editRoutineData,
      )
      .subscribe({
        next: (response) => {
          console.log('Routine edited successfully:', response);
          this.getPatientRoutineList();
          this.showSuccess('Routine edited successfully!');
          this.onEdit = false;
          this.routineData.reset({
            type: 3,
            title: '',
            frequency: 1,
            reminderDate: '',
            reminderTime: '',
            notes: '',
          });
        },
        error: (err) => {
          console.error('Error editing routine:', err);
          this.showError('Failed to edit routine.');
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

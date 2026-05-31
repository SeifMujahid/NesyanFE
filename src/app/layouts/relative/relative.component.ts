import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MainNavComponent } from 'src/app/components/main-nav/main-nav.component';
import { RelativeService } from 'src/app/core/services/relative.service';
import { MainService } from 'src/app/context/main.service';
import { RelativePatientsList } from 'src/app/core/interfaces/patients';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relative',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MainNavComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.scss'],
})
export class RelativeComponent implements OnInit {
  relativePatientsList: RelativePatientsList[] = [];
  patientDetails: RelativePatientsList = {} as RelativePatientsList;
  relativeID: string = '';
  activeIndex: number = 0;
  constructor(
    private _relativeService: RelativeService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  patientData: FormGroup = new FormGroup({
    patientId: new FormControl(null, [
      Validators.required,
      Validators.pattern('^\\d{14}$'),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((userId) => {
      this.relativeID = userId;
      this.getRelativePatientList();
    });
  }

  getRelativePatientList(): void {
    this._relativeService
      .getRelativePatientList(Number(this.relativeID))
      .subscribe({
        next: (response) => {
          this.relativePatientsList = response.patientsSummary;
          this.patientDetails = this.relativePatientsList[0];
          this._mainService.setCurrentPatientID(
            this.relativePatientsList[0].patientId.toString(),
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  selectPatient(patientID: number, index: number) {
    this._mainService.setCurrentPatientID(patientID.toString());
    this.activeIndex = index;
    this.patientDetails = this.relativePatientsList[index];
  }

  addNewPatient(): void {
    if (this.patientData.valid) {
      this._relativeService
        .addExistingPatient(Number(this.relativeID), {
          nationalId: this.patientData.value.patientId,
          email: this.patientData.value.email,
        })
        .subscribe({
          next: (response) => {
            this.showSuccess('Patient Added Sucessfully');
            this.getRelativePatientList();
          },
          error: (err) => {
            this.showError('Faild To Add Patient');
            console.log(err);
          },
        });
      this.patientData.reset({
        patientId: null,
        email: null,
      });
    } else {
      this.showError("Invalid Patient's Data");
      this.patientData.reset({
        patientId: null,
        email: null,
      });
    }
  }

  showSuccess(message: string): void {
    this.toastr.success(message);
  }
  showError(message: string): void {
    this.toastr.error(message);
  }
}

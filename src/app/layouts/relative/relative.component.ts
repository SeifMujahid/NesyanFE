import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MainNavComponent } from 'src/app/components/main-nav/main-nav.component';
import { RelativeService } from 'src/app/core/services/relative.service';
import { MainService } from 'src/app/context/main.service';
import { RelativePatientsList } from 'src/app/core/interfaces/patients';

@Component({
  selector: 'app-relative',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MainNavComponent,
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
}

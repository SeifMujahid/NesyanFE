import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddMindGame,
  PatientMindGamesList,
} from 'src/app/core/interfaces/patients';
import { DoctorService } from 'src/app/core/services/doctor.service';
import { MainService } from 'src/app/context/main.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-mind-games',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mind-games.component.html',
  styleUrls: ['./mind-games.component.scss'],
})
export class MindGamesComponent implements OnInit {
  patientMindGamesList: PatientMindGamesList[] = [];
  allMindGamesList: PatientMindGamesList[] = [];
  gameDetails: PatientMindGamesList = {} as PatientMindGamesList;
  addGameForm: AddMindGame = {} as AddMindGame;
  doctorId: number = 0;
  patientId: number = 0;

  constructor(
    private _doctorService: DoctorService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((doctorId) => {
      this.doctorId = Number(doctorId);
    });
    this._mainService.currentPatientID.subscribe((patientId) => {
      this.patientId = Number(patientId);
      this.getPatientMindGames();
      this.getAllMindGamesList();
    });
  }

  addGame: FormGroup = new FormGroup({
    doctorId: new FormControl(this.doctorId, Validators.required),
    frequency: new FormControl('Daily', Validators.required),
    startDate: new FormControl('', Validators.required),
  });

  getPatientMindGames(): void {
    this._doctorService.getPatientsMindGamesList(this.patientId).subscribe({
      next: (response) => {
        const games = response;
        this.patientMindGamesList = [];
        games.forEach((game: any) => {
          this.patientMindGamesList.push(game.mindGame);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePatientMindGame(gameId: number): void {
    this._doctorService
      .deletePatientMindGame(this.patientId, gameId)
      .subscribe({
        next: () => {
          this.showSuccess('Game deleted successfully');
          this.getPatientMindGames();
        },
        error: () => {
          this.showError('Failed to delete the game');
        },
      });
  }

  getAllMindGamesList(): void {
    this._doctorService.getAllMindGames().subscribe({
      next: (response) => {
        this.allMindGamesList = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  completeAddPatientMindGame(gameId: number): void {
    if (this.addGame.valid) {
      this.addGameForm.doctorId = this.doctorId;
      this.addGameForm.frequency = this.addGame.value.frequency;
      this.addGameForm.startDate = this.addGame.value.startDate;
      this.addPatientMindGame(gameId);
    } else {
      this.showError('Please fill all required fields correctly');
    }
  }

  addPatientMindGame(gameId: number): void {
    this._doctorService
      .addPatientMindGame(this.patientId, gameId, this.addGameForm)
      .subscribe({
        next: (response) => {
          this.showSuccess('Game added successfully');
          this.getPatientMindGames();
          this.addGame.reset({
            doctorId: this.doctorId,
            frequency: 'Daily',
            startDate: '',
          });
        },
        error: (err) => {
          this.showError('Failed to add the game');
        },
      });
  }

  showDetails(gameIndex: number): void {
    this.gameDetails = this.allMindGamesList[gameIndex];
  }
  showSuccess(message: string) {
    this.toastr.success(message);
  }
  showError(message: string) {
    this.toastr.error(message);
  }
}

import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { PatientRegisterInterface } from 'src/app/core/interfaces/patient-register-interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MainService } from 'src/app/context/main.service';
import { RelativeRegisterInterface } from 'src/app/core/interfaces/relative-register-interface';
import { CaregiverRegisterInterface } from 'src/app/core/interfaces/caregiver-register-interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  currentStep: number = 1;
  selectedRole: string = '';
  selectedChronicDisease: string[] = [];
  chronicDisease: string = '';
  isDragOver: boolean = false;
  degreeFileDoctor: File | null = null;
  cardFileDoctor: File | null = null;
  degreeFileCaregiver: File | null = null;
  cardFileCaregiver: File | null = null;
  allowedTypes: string[] = [
    'application/pdf',
    'image/png',
    'image/jpg',
    'image/jpeg',
  ];
  maxFileSize: number = 5 * 1024 * 1024;
  patientData: PatientRegisterInterface = {} as PatientRegisterInterface;
  relativeData: RelativeRegisterInterface = {} as RelativeRegisterInterface;
  caregiverData: CaregiverRegisterInterface = {} as CaregiverRegisterInterface;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _mainService: MainService,
  ) {}

  chooseMethod(): void {
    if (this.currentStep === 1) {
      this.submitPersonalInformation();
    } else if (this.currentStep === 2) {
      switch (this.selectedRole) {
        case 'relative':
          this.completeRelatievRegistration();
          break;
        case 'caregiver':
          this.completeCaregiverRegistration();
          break;
        default:
          this.submitAccountDetails();
      }
    } else if (this.currentStep === 3) {
      switch (this.selectedRole) {
        case 'patient':
          this.completePatientRegistration();
          break;
        case 'doctor':
          this.completeDoctorRegistration();
          break;
        default:
          console.log('Please select a role');
      }
    }
  }

  personalInformation: FormGroup = new FormGroup({
    nationalId: new FormControl(null, [
      Validators.required,
      Validators.pattern('^\\d{14}$'),
    ]),
    fName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z\u0600-\u06FF]+$/),
    ]),
    lName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z\u0600-\u06FF]+$/),
    ]),
    userName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z0-9\u0600-\u06FF._-]+$/),
    ]),
    gender: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
  });

  accountDetails: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    ]),
    age: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(120),
      Validators.pattern('^[0-9]+$'),
    ]),
  });

  patientMedicalHistory: FormGroup = new FormGroup({
    currentStage: new FormControl(1, [Validators.required]),
    height: new FormControl(null, [
      Validators.required,
      Validators.min(30),
      Validators.max(300),
      Validators.pattern('^[0-9]+$'),
    ]),
    weight: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(500),
      Validators.pattern('^[0-9]+$'),
    ]),
    bloodType: new FormControl(null, [Validators.required]),
  });

  // doctorProfessionalInformation: FormGroup = new FormGroup({
  //   graduationDegree: new FormControl(null, [Validators.required]),
  //   medicalAssociationCard: new FormControl(null, [Validators.required]),
  // });

  submitPersonalInformation(): void {
    if (this.personalInformation.valid) {
      this.nextStep();
    } else {
      console.log('there is error');
      this.personalInformation.markAllAsTouched();
    }
  }

  submitAccountDetails(): void {
    if (this.accountDetails.valid) {
      this.nextStep();
    } else {
      console.log('there is error');
      this.accountDetails.markAllAsTouched();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////

  completePatientRegistration(): void {
    if (this.patientMedicalHistory.valid) {
      // Personal Information
      this.patientData.nationalId = this.personalInformation.value.nationalId;
      this.patientData.fName =
        this.personalInformation.value.fName.toLowerCase();
      this.patientData.lName =
        this.personalInformation.value.lName.toLowerCase();
      this.patientData.userName = this.personalInformation.value.userName;
      this.patientData.gender = Number(this.personalInformation.value.gender);
      this.patientData.country =
        this.personalInformation.value.country.toLowerCase();
      this.patientData.city = this.personalInformation.value.city.toLowerCase();
      // Account Details
      this.patientData.email = this.accountDetails.value.email;
      this.patientData.password = this.accountDetails.value.password;
      this.patientData.age = this.accountDetails.value.age;
      //Medical Details
      this.patientData.currentStage =
        this.patientMedicalHistory.value.currentStage;
      this.patientData.height = this.patientMedicalHistory.value.height;
      this.patientData.weight = this.patientMedicalHistory.value.weight;
      this.patientData.bloodType = Number(
        this.patientMedicalHistory.value.bloodType,
      );
      this.patientData.chronicDisease = this.chronicDisease;
      console.log(this.patientData);
      this.patientRegister();
    } else {
      console.log('there is error');
      this.accountDetails.markAllAsTouched();
    }
  }

  patientRegister(): void {
    this._authService.patientRegister(this.patientData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this._mainService.setRegisteredEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Registration failed:', err);
      },
    });
  }

  //////////////////////////////////////////////////

  completeDoctorRegistration(): void {
    if (
      this.personalInformation.valid &&
      this.accountDetails.valid &&
      this.degreeFileDoctor &&
      this.cardFileDoctor
    ) {
      const formData = new FormData();

      // Files
      formData.append('GraduationDegree', this.degreeFileDoctor as File);

      formData.append('MedicalAssociationCard', this.cardFileDoctor as File);

      // Personal Information
      formData.append('NationalId', this.personalInformation.value.nationalId);

      formData.append('FName', this.personalInformation.value.fName);

      formData.append('LName', this.personalInformation.value.lName);

      formData.append('UserName', this.personalInformation.value.userName);

      formData.append('Gender', this.personalInformation.value.gender);

      formData.append('Country', this.personalInformation.value.country);

      formData.append('City', this.personalInformation.value.city);

      // Account Details
      formData.append('Email', this.accountDetails.value.email);

      formData.append('Password', this.accountDetails.value.password);

      formData.append('Age', this.accountDetails.value.age);

      this.doctorRegister(formData);
      // Debug
      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });
    } else {
      console.log('there is error');
      this.personalInformation.markAllAsTouched();
      this.accountDetails.markAllAsTouched();
    }
  }

  doctorRegister(formData: FormData): void {
    this._authService.doctorRegister(formData).subscribe({
      next: (response) => {
        console.log('Doctor registration successful:', response);
        this._mainService.setRegisteredEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Doctor registration failed:', err);
      },
    });
  }

  //////////////////////////////////////////////////

  completeRelatievRegistration() {
    // Personal Information
    this.relativeData.nationalId = this.personalInformation.value.nationalId;
    this.relativeData.fName =
      this.personalInformation.value.fName.toLowerCase();
    this.relativeData.lName =
      this.personalInformation.value.lName.toLowerCase();
    this.relativeData.userName = this.personalInformation.value.userName;
    this.relativeData.gender = Number(this.personalInformation.value.gender);
    this.relativeData.country =
      this.personalInformation.value.country.toLowerCase();
    this.relativeData.city = this.personalInformation.value.city.toLowerCase();
    // Account Details
    this.relativeData.email = this.accountDetails.value.email;
    this.relativeData.password = this.accountDetails.value.password;
    this.relativeData.age = this.accountDetails.value.age;
    console.log(this.relativeData);
    this.relatieRegistr();
  }

  relatieRegistr() {
    this._authService.relatieRegister(this.relativeData).subscribe({
      next: (response) => {
        console.log('Relative registration successful:', response);
        this._mainService.setRegisteredEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Relative registration failed:', err);
      },
    });
  }

  //////////////////////////////////////////////////

  completeCaregiverRegistration() {
    // Personal Information
    this.caregiverData.nationalId = this.personalInformation.value.nationalId;
    this.caregiverData.fName =
      this.personalInformation.value.fName.toLowerCase();
    this.caregiverData.lName =
      this.personalInformation.value.lName.toLowerCase();
    this.caregiverData.userName = this.personalInformation.value.userName;
    this.caregiverData.gender = Number(this.personalInformation.value.gender);
    this.caregiverData.country =
      this.personalInformation.value.country.toLowerCase();
    this.caregiverData.city = this.personalInformation.value.city.toLowerCase();
    // Account Details
    this.caregiverData.email = this.accountDetails.value.email;
    this.caregiverData.password = this.accountDetails.value.password;
    this.caregiverData.age = this.accountDetails.value.age;
    console.log(this.caregiverData);
    this.registerCaregiver();
  }

  registerCaregiver() {
    this._authService.caregiverRegister(this.caregiverData).subscribe({
      next: (response) => {
        console.log('Caregiver registration successful:', response);
        this._mainService.setRegisteredEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Caregiver registration failed:', err);
      },
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this._router.navigate(['/nesyan']);
    }
  }

  onChronicDiseaseSelect(event: any, value: string) {
    if (event.target.checked) {
      this.selectedChronicDisease.push(value);
    } else {
      this.selectedChronicDisease = this.selectedChronicDisease.filter(
        (item) => item !== value,
      );
    }
    this.chronicDisease = this.selectedChronicDisease.join(', ');
  }

  onRoleSelect(role: string) {
    this.selectedRole = role;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent, type: 'degree' | 'card'): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0], type);
    }
  }

  onFileSelect(event: Event, type: 'degree' | 'card'): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.handleFile(input.files[0], type);
    }
  }

  handleFile(file: File, type: 'degree' | 'card'): void {
    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      console.log('Only PDF, JPG, JPEG, PNG files are allowed');
      return;
    }
    // Validate file size
    if (file.size > this.maxFileSize) {
      console.log('File size must be less than 5MB');
      return;
    }
    // Save file
    if (type === 'degree') {
      this.degreeFileDoctor = file;
      // this.doctorProfessionalInformation
      //   .get('graduationDegree')
      //   ?.setValue(this.degreeFileDoctor);
    } else {
      this.cardFileDoctor = file;
      // this.doctorProfessionalInformation
      //   .get('medicalAssociationCard')
      //   ?.setValue(this.cardFileDoctor);
    }
    console.log(file);
  }

  removeFile(type: 'degree' | 'card', event: Event): void {
    event.stopPropagation();
    if (type === 'degree') {
      this.degreeFileDoctor = null;
      // this.doctorProfessionalInformation
      //   .get('graduationDegree')
      //   ?.setValue(null);
    } else {
      this.cardFileDoctor = null;
      // this.doctorProfessionalInformation
      //   .get('medicalAssociationCard')
      //   ?.setValue(null);
    }
  }

  submit(): void {
    const formData = new FormData();
    if (this.degreeFileDoctor) {
      formData.append('graduationDegree', this.degreeFileDoctor);
    }
    if (this.cardFileDoctor) {
      formData.append('medicalAssociationCard', this.cardFileDoctor);
    }
    console.log(formData);
  }
}

import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

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
  userImage: File | null = null;
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

  toastr = inject(ToastrService);

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
    nationalId: new FormControl(null, [
      Validators.required,
      Validators.pattern('^\\d{14}$'),
    ]),
    age: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(120),
      Validators.pattern('^[0-9]+$'),
    ]),
    gender: new FormControl('', [Validators.required]),
    maritalStatus: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl(null, [Validators.required]),
  });

  accountDetails: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern('^01[0125][0-9]{8}$'),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    ]),
  });

  patientMedicalHistory: FormGroup = new FormGroup({
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
    bloodType: new FormControl('', [Validators.required]),
    currentStage: new FormControl(1, [Validators.required]),
  });

  doctorSpecialization: FormGroup = new FormGroup({
    specialization: new FormControl(null, [Validators.required]),
  });

  // doctorProfessionalInformation: FormGroup = new FormGroup({
  //   graduationDegree: new FormControl(null, [Validators.required]),
  //   medicalAssociationCard: new FormControl(null, [Validators.required]),
  // });

  submitPersonalInformation(): void {
    if (this.personalInformation.valid) {
      this.nextStep();
    } else {
      this.personalInformation.markAllAsTouched();

      const firstInvalid = Object.entries(
        this.personalInformation.controls,
      ).find(([_, control]) => control.invalid);

      if (firstInvalid) {
        const [fieldName, control] = firstInvalid;

        const errorType = Object.keys(control.errors!)[0];

        const errorMessages: any = {
          nationalId: {
            required: {
              message: 'National ID is required',
              hint: 'Enter your 14-digit national ID',
            },
            pattern: {
              message: 'Invalid National ID',
              hint: 'National ID must contain exactly 14 numbers',
            },
          },

          fName: {
            required: {
              message: 'First name is required',
              hint: 'Enter your first name',
            },
            minlength: {
              message: 'First name is too short',
              hint: 'Minimum length is 3 characters',
            },
            maxlength: {
              message: 'First name is too long',
              hint: 'Maximum length is 20 characters',
            },
            pattern: {
              message: 'Invalid first name',
              hint: 'Use letters only',
            },
          },

          lName: {
            required: {
              message: 'Last name is required',
              hint: 'Enter your last name',
            },
            minlength: {
              message: 'Last name is too short',
              hint: 'Minimum length is 3 characters',
            },
            maxlength: {
              message: 'Last name is too long',
              hint: 'Maximum length is 20 characters',
            },
            pattern: {
              message: 'Invalid last name',
              hint: 'Use letters only',
            },
          },

          userName: {
            required: {
              message: 'Username is required',
              hint: 'Enter a username',
            },
            minlength: {
              message: 'Username is too short',
              hint: 'Minimum length is 3 characters',
            },
            maxlength: {
              message: 'Username is too long',
              hint: 'Maximum length is 20 characters',
            },
            pattern: {
              message: 'Invalid username',
              hint: 'Use letters, numbers, ".", "_" or "-" only',
            },
          },

          gender: {
            required: {
              message: 'Gender is required',
              hint: 'Please select your gender',
            },
          },

          maritalStatus: {
            required: {
              message: 'Marital status is required',
              hint: 'Please select your marital status',
            },
          },

          country: {
            required: {
              message: 'Country is required',
              hint: 'Please select your country',
            },
          },

          city: {
            required: {
              message: 'City is required',
              hint: 'Please enter your city',
            },
          },

          age: {
            required: {
              message: 'Age is required',
              hint: 'Enter your age',
            },
            min: {
              message: 'Invalid age',
              hint: 'Age must be greater than 0',
            },
            max: {
              message: 'Invalid age',
              hint: 'Age must be less than or equal to 120',
            },
            pattern: {
              message: 'Invalid age',
              hint: 'Age must contain numbers only',
            },
          },
        };

        const errorData = errorMessages[fieldName]?.[errorType];

        if (errorData) {
          this.showError(errorData.message, errorData.hint);
        } else {
          this.showError('Invalid field', 'Please check your input');
        }
      }
    }
  }

  submitAccountDetails(): void {
    if (this.accountDetails.valid && this.selectedRole) {
      this.nextStep();
    } else {
      this.accountDetails.markAllAsTouched();

      const firstInvalid = Object.entries(this.accountDetails.controls).find(
        ([_, control]) => control.invalid,
      );
      if (!this.selectedRole) {
        this.showError(
          'Register as is required',
          'Please check choose your role',
        );
      }

      if (firstInvalid) {
        const [fieldName, control] = firstInvalid;

        const errorType = Object.keys(control.errors!)[0];

        const errorMessages: any = {
          email: {
            required: {
              message: 'Email is required',
              hint: 'Enter your email address',
            },
            email: {
              message: 'Invalid email address',
              hint: 'Enter a valid email like example@gmail.com',
            },
          },

          phone: {
            required: {
              message: 'Phone number is required',
              hint: 'Enter your phone number',
            },
            pattern: {
              message: 'Invalid phone number',
              hint: 'Phone number must be a valid Egyptian number',
            },
          },

          password: {
            required: {
              message: 'Password is required',
              hint: 'Enter your password',
            },
            minlength: {
              message: 'Password is too short',
              hint: 'Password must be at least 8 characters',
            },
            maxlength: {
              message: 'Password is too long',
              hint: 'Password must not exceed 20 characters',
            },
            pattern: {
              message: 'Weak password',
              hint: 'Use at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
          },
        };

        const errorData = errorMessages[fieldName]?.[errorType];

        if (errorData) {
          this.showError(errorData.message, errorData.hint);
        } else {
          this.showError('Invalid field', 'Please check your input');
        }
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////

  completePatientRegistration(): void {
    if (
      this.personalInformation.valid &&
      this.accountDetails.valid &&
      this.patientMedicalHistory.valid &&
      this.selectedChronicDisease.length > 0
    ) {
      const formData = new FormData();
      // Personal Information
      formData.append('NationalId', this.personalInformation.value.nationalId);

      formData.append('FName', this.personalInformation.value.fName);

      formData.append('LName', this.personalInformation.value.lName);

      formData.append('UserName', this.personalInformation.value.userName);

      formData.append('Gender', this.personalInformation.value.gender);

      formData.append('Country', this.personalInformation.value.country);

      formData.append('City', this.personalInformation.value.city);

      formData.append('Age', this.personalInformation.value.age);

      formData.append(
        'MaritalStatus',
        this.personalInformation.value.maritalStatus,
      );
      // Account Details
      formData.append('Email', this.accountDetails.value.email);

      formData.append('Password', this.accountDetails.value.password);

      formData.append('Phone', this.accountDetails.value.phone);

      if (this.userImage) {
        formData.append('Image', this.userImage as File);
      }

      //Medical Details
      formData.append(
        'CurrentStage',
        this.patientMedicalHistory.value.currentStage,
      );

      formData.append('Height', this.patientMedicalHistory.value.height);

      formData.append('Weight', this.patientMedicalHistory.value.weight);

      formData.append('BloodType', this.patientMedicalHistory.value.bloodType);

      this.selectedChronicDisease.forEach((disease) => {
        formData.append('Diseases', disease);
      });

      formData.append(
        'CurrentStage',
        this.patientMedicalHistory.value.currentStage,
      );

      this.patientRegister(formData);
    } else {
      console.log('there is error');
      this.patientMedicalHistory.markAllAsTouched();
      const firstInvalid = Object.entries(
        this.patientMedicalHistory.controls,
      ).find(([_, control]) => control.invalid);

      if (this.selectedChronicDisease.length <= 0) {
        this.showError(
          'Chronic disease is required',
          'Please select at least one chronic disease',
        );
      }

      if (firstInvalid) {
        const [fieldName, control] = firstInvalid;

        const errorType = Object.keys(control.errors!)[0];

        const errorMessages: any = {
          currentStage: {
            required: {
              message: 'Current stage is required',
              hint: 'Please select the current stage',
            },
          },

          height: {
            required: {
              message: 'Height is required',
              hint: 'Enter your height in centimeters',
            },
            min: {
              message: 'Invalid height',
              hint: 'Height must be greater than or equal to 30 cm',
            },
            max: {
              message: 'Invalid height',
              hint: 'Height must be less than or equal to 300 cm',
            },
            pattern: {
              message: 'Invalid height',
              hint: 'Height must contain numbers only',
            },
          },

          weight: {
            required: {
              message: 'Weight is required',
              hint: 'Enter your weight in kilograms',
            },
            min: {
              message: 'Invalid weight',
              hint: 'Weight must be greater than or equal to 1 kg',
            },
            max: {
              message: 'Invalid weight',
              hint: 'Weight must be less than or equal to 500 kg',
            },
            pattern: {
              message: 'Invalid weight',
              hint: 'Weight must contain numbers only',
            },
          },

          bloodType: {
            required: {
              message: 'Blood type is required',
              hint: 'Please select your blood type',
            },
          },
        };

        const errorData = errorMessages[fieldName]?.[errorType];

        if (errorData) {
          this.showError(errorData.message, errorData.hint);
        } else {
          this.showError('Invalid field', 'Please check your input');
        }
      }
    }
  }

  patientRegister(formData: FormData): void {
    this._authService.patientRegister(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.showSuccess(response.message);
        this._mainService.setTempEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Registration failed:', err);
        this.showErrorMessage(err.error.message);
      },
    });
  }

  //////////////////////////////////////////////////

  completeDoctorRegistration(): void {
    if (
      this.personalInformation.valid &&
      this.accountDetails.valid &&
      this.doctorSpecialization.valid &&
      this.degreeFileDoctor &&
      this.cardFileDoctor
    ) {
      const formData = new FormData();

      // Personal Information
      formData.append('NationalId', this.personalInformation.value.nationalId);

      formData.append('FName', this.personalInformation.value.fName);

      formData.append('LName', this.personalInformation.value.lName);

      formData.append('UserName', this.personalInformation.value.userName);

      formData.append('Gender', this.personalInformation.value.gender);

      formData.append('Country', this.personalInformation.value.country);

      formData.append('City', this.personalInformation.value.city);

      formData.append('Age', this.personalInformation.value.age);

      formData.append(
        'MaritalStatus',
        this.personalInformation.value.maritalStatus,
      );

      // Account Details
      formData.append('Email', this.accountDetails.value.email);

      formData.append('Password', this.accountDetails.value.password);

      formData.append('Phone', this.accountDetails.value.phone);

      if (this.userImage) {
        formData.append('Image', this.userImage as File);
      }

      // Professional Details
      formData.append(
        'Specialization',
        this.doctorSpecialization.value.specialization,
      );

      formData.append('GraduationDegree', this.degreeFileDoctor as File);

      formData.append('MedicalAssociationCard', this.cardFileDoctor as File);

      this.doctorRegister(formData);
      // Debug
      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });
    } else {
      console.log('there is error');
      if (this.doctorSpecialization.invalid) {
        this.showError(
          'Specialization is required',
          'Please enter your specialization',
        );
      }
      if (!this.degreeFileDoctor) {
        this.showError(
          'Graduation degree is required',
          'Please upload your graduation degree',
        );
      }
      if (!this.cardFileDoctor) {
        this.showError(
          'Medical association card is required',
          'Please upload your medical association card',
        );
      }
    }
  }

  doctorRegister(formData: FormData): void {
    this._authService.doctorRegister(formData).subscribe({
      next: (response) => {
        console.log('Doctor registration successful:', response);
        this.showSuccess(response.message);
        this._mainService.setTempEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Doctor registration failed:', err);
        this.showErrorMessage(err.error.message);
      },
    });
  }

  //////////////////////////////////////////////////

  completeRelatievRegistration() {
    if (this.personalInformation.valid && this.accountDetails.valid) {
      const formData = new FormData();
      // Personal Information
      formData.append('NationalId', this.personalInformation.value.nationalId);

      formData.append('FName', this.personalInformation.value.fName);

      formData.append('LName', this.personalInformation.value.lName);

      formData.append('UserName', this.personalInformation.value.userName);

      formData.append('Gender', this.personalInformation.value.gender);

      formData.append('Country', this.personalInformation.value.country);

      formData.append('City', this.personalInformation.value.city);

      formData.append('Age', this.personalInformation.value.age);

      formData.append(
        'MaritalStatus',
        this.personalInformation.value.maritalStatus,
      );
      // Account Details
      formData.append('Email', this.accountDetails.value.email);

      formData.append('Password', this.accountDetails.value.password);

      formData.append('Phone', this.accountDetails.value.phone);

      if (this.userImage) {
        formData.append('Image', this.userImage as File);
      }

      this.relatieRegistr(formData);
    } else {
      console.log('there is error');
      this.personalInformation.markAllAsTouched();
      this.accountDetails.markAllAsTouched();
    }
  }

  relatieRegistr(formData: FormData) {
    this._authService.relatieRegister(formData).subscribe({
      next: (response) => {
        console.log('Relative registration successful:', response);
        this.showSuccess(response.message);
        this._mainService.setTempEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Relative registration failed:', err);
        this.showErrorMessage(err.error.message);
      },
    });
  }

  //////////////////////////////////////////////////

  completeCaregiverRegistration() {
    if (this.personalInformation.valid && this.accountDetails.valid) {
      const formData = new FormData();
      // Personal Information
      formData.append('NationalId', this.personalInformation.value.nationalId);

      formData.append('FName', this.personalInformation.value.fName);

      formData.append('LName', this.personalInformation.value.lName);

      formData.append('UserName', this.personalInformation.value.userName);

      formData.append('Gender', this.personalInformation.value.gender);

      formData.append('Country', this.personalInformation.value.country);

      formData.append('City', this.personalInformation.value.city);

      formData.append('Age', this.personalInformation.value.age);

      formData.append(
        'MaritalStatus',
        this.personalInformation.value.maritalStatus,
      );
      // Account Details
      formData.append('Email', this.accountDetails.value.email);

      formData.append('Password', this.accountDetails.value.password);

      formData.append('Phone', this.accountDetails.value.phone);

      if (this.userImage) {
        formData.append('Image', this.userImage as File);
      }

      this.registerCaregiver(formData);
    } else {
      console.log('there is error');
      this.personalInformation.markAllAsTouched();
      this.accountDetails.markAllAsTouched();
    }
  }

  registerCaregiver(formData: FormData) {
    this._authService.caregiverRegister(formData).subscribe({
      next: (response) => {
        console.log('Caregiver registration successful:', response);
        this.showSuccess(response.message);
        this._mainService.setTempEmail(response.email);
        this._router.navigate(['/auth/verifay-account']);
      },
      error: (err) => {
        console.log('Caregiver registration failed:', err);
        this.showErrorMessage(err.error.message);
      },
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////

  getFirstInvalidControl(form: FormGroup) {
    return Object.entries(form.controls).find(
      ([_, control]) => control.invalid,
    );
  }

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

  onDrop(event: DragEvent, type: 'degree' | 'card' | 'image'): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0], type);
    }
  }

  onFileSelect(event: Event, type: 'degree' | 'card' | 'image'): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.handleFile(input.files[0], type);
    }
  }

  handleFile(file: File, type: 'degree' | 'card' | 'image'): void {
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
    } else if (type === 'image') {
      this.userImage = file;
    } else {
      this.cardFileDoctor = file;
      // this.doctorProfessionalInformation
      //   .get('medicalAssociationCard')
      //   ?.setValue(this.cardFileDoctor);
    }
    console.log(file);
  }

  removeFile(type: 'degree' | 'card' | 'image', event: Event): void {
    event.stopPropagation();
    if (type === 'degree') {
      this.degreeFileDoctor = null;
      // this.doctorProfessionalInformation
      //   .get('graduationDegree')
      //   ?.setValue(null);
    } else if (type === 'image') {
      this.userImage = null;
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
    if (this.userImage) {
      formData.append('userImage', this.userImage);
    }
    console.log(formData);
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }
  showError(message: string, hint: string) {
    this.toastr.error(hint, message);
  }
  showErrorMessage(message: string) {
    this.toastr.error(message);
  }
}

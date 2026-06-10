import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaregiverService } from 'src/app/core/services/caregiver.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import { CaregiverProfile } from 'src/app/core/interfaces/caregiver';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-caregiver-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MainNavComponent, RouterLink],
  templateUrl: './caregiver-profile.component.html',
  styleUrls: ['./caregiver-profile.component.scss'],
})
export class CaregiverProfileComponent implements OnInit {
  caregiverId: number = 0;
  caregiverProfile: CaregiverProfile = {} as CaregiverProfile;
  isEditMode: boolean = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  profileForm: FormGroup = new FormGroup({
    // ── Editable ──────────────────────────────────────────────────
    fName: new FormControl({ value: null, disabled: true }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z\u0600-\u06FF]+$/),
    ]),
    lName: new FormControl({ value: null, disabled: true }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z\u0600-\u06FF]+$/),
    ]),
    userName: new FormControl({ value: null, disabled: true }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z0-9\u0600-\u06FF._-]+$/),
    ]),
    age: new FormControl({ value: null, disabled: true }, [
      Validators.required,
      Validators.min(1),
      Validators.max(120),
      Validators.pattern('^[0-9]+$'),
    ]),
    country: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    city: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    phone: new FormControl({ value: null, disabled: true }, [
      Validators.required,
      Validators.pattern('^[0-9]{10,15}$'),
    ]),

    // ── Always read-only ──────────────────────────────────────────
    email: new FormControl({ value: null, disabled: true }),
    gender: new FormControl({ value: null, disabled: true }),
    nationalId: new FormControl({ value: null, disabled: true }),
  });

  private readonly editableFields: string[] = [
    'fName',
    'lName',
    'userName',
    'age',
    'country',
    'city',
    'phone',
  ];

  toastr = inject(ToastrService);

  constructor(
    private _caregiverService: CaregiverService,
    private _mainService: MainService,
  ) {}

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((caregiverID) => {
      this.caregiverId = Number(caregiverID);
      this.getCaregiverProfile();
    });
  }

  getCaregiverProfile(): void {
    this._caregiverService.getCaregiverProfile(this.caregiverId).subscribe({
      next: (response) => {
        this.caregiverProfile = response;
        this.patchForm(response);
        if (response.imageUrl) {
          this.imagePreview = response.imageUrl;
        }
      },
      error: (err) => console.error(err),
    });
  }

  private patchForm(profile: CaregiverProfile): void {
    this.profileForm.patchValue({
      fName: profile.fName,
      lName: profile.lName,
      userName: profile.userName,
      age: profile.age,
      country: profile.country,
      city: profile.city,
      phone: profile.phone,
      email: profile.email,
      gender: profile.gender,
      nationalId: profile.nationalId,
    });
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;

    this.editableFields.forEach((field) => {
      const control = this.profileForm.get(field);
      this.isEditMode ? control?.enable() : control?.disable();
    });

    // Cancel → restore original values
    if (!this.isEditMode) {
      this.patchForm(this.caregiverProfile);
      this.imagePreview = this.caregiverProfile.imageUrl ?? null;
      this.selectedImage = null;
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(this.selectedImage);
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const formData = new FormData();

    // Always required by the API
    formData.append('Id', String(this.caregiverId));
    formData.append('NationalId', this.caregiverProfile.nationalId);
    formData.append('Email', this.caregiverProfile.email);
    formData.append('Gender', this.caregiverProfile.gender);
    formData.append('ImageUrl', this.caregiverProfile.imageUrl ?? '');

    // Editable fields
    formData.append('FName', this.profileForm.get('fName')?.value);
    formData.append('LName', this.profileForm.get('lName')?.value);
    formData.append('UserName', this.profileForm.get('userName')?.value);
    formData.append('Phone', this.profileForm.get('phone')?.value);
    formData.append('Country', this.profileForm.get('country')?.value);
    formData.append('City', this.profileForm.get('city')?.value);
    formData.append('Age', String(this.profileForm.get('age')?.value));

    // New image file (only if user changed it)
    if (this.selectedImage) {
      formData.append('Image', this.selectedImage, this.selectedImage.name);
    }

    this._caregiverService
      .editCaregiverProfile(this.caregiverId, formData)
      .subscribe({
        next: (response) => {
          this.caregiverProfile = { ...this.caregiverProfile, ...response };
          this.getCaregiverProfile();
          this.showSuccess('Profile Edited Successfully');
          this.toggleEdit();
        },
        error: (err) => {
          console.error(err);
          this.showError('Failed To Edit Profile');
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

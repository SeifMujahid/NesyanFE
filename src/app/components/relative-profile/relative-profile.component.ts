import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavComponent } from '../main-nav/main-nav.component';
import { RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RelativeProfile } from 'src/app/core/interfaces/relative';
import { MainService } from 'src/app/context/main.service';
import { RelativeService } from 'src/app/core/services/relative.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relative-profile',
  standalone: true,
  imports: [CommonModule, MainNavComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './relative-profile.component.html',
  styleUrls: ['./relative-profile.component.scss'],
})
export class RelativeProfileComponent implements OnInit {
  relativeId: number = 0;
  relativeProfile: RelativeProfile = {} as RelativeProfile;
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

  constructor(
    private _relativeService: RelativeService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((relativeID) => {
      this.relativeId = Number(relativeID);
      this.getRelativeProfile();
    });
  }

  getRelativeProfile(): void {
    this._relativeService.getRelativeProfile(this.relativeId).subscribe({
      next: (response) => {
        this.relativeProfile = response;
        this.patchForm(response);
        if (response.imageUrl) {
          this.imagePreview = response.imageUrl;
        }
      },
      error: (err) => console.error(err),
    });
  }

  private patchForm(profile: RelativeProfile): void {
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
      this.patchForm(this.relativeProfile);
      this.imagePreview = this.relativeProfile.imageUrl ?? null;
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
    formData.append('Id', String(this.relativeId));
    formData.append('NationalId', this.relativeProfile.nationalId);
    formData.append('Email', this.relativeProfile.email);
    formData.append('Gender', this.relativeProfile.gender);
    formData.append('ImageUrl', this.relativeProfile.imageUrl ?? '');

    // Editable fields — read raw value because controls may still be enabled
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

    this._relativeService
      .editRelativeProfile(this.relativeId, formData)
      .subscribe({
        next: (response) => {
          // Update local snapshot so Cancel won't revert to stale data
          this.relativeProfile = { ...this.relativeProfile, ...response };
          this.getRelativeProfile();
          this.showSuccess('Profile Edited Sucessfully');
          this.toggleEdit(); // exits edit mode & disables fields
        },
        error: (err) => {
          console.error(err);
          this.showError('Faild To Edit Profie');
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

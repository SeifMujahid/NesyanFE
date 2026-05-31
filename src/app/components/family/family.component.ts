import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientFamilyList } from 'src/app/core/interfaces/patients';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/context/main.service';
import { RelativeService } from 'src/app/core/services/relative.service';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {
  patientFamilyList: PatientFamilyList[] = [];
  memberImage: File | null = null;
  memberaudio: File | null = null;
  relativeId: number = 0;
  patientId: number = 0;
  memberIndex: number = 0;
  membertId: number = 0;
  onEdit: boolean = false;
  isDragOver: boolean = false;
  allowedImageTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg'];
  allowedaudioTypes: string[] = ['audio/mpeg', 'audio/mp3', 'audio/mpeg'];
  maxFileSize: number = 5 * 1024 * 1024;

  constructor(
    private _relativeService: RelativeService,
    private _mainService: MainService,
  ) {}

  toastr = inject(ToastrService);

  memberForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    relation: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^01[0125][0-9]{8}$'),
    ]),
  });

  ngOnInit(): void {
    this._mainService.currentUserId.subscribe((relativeId) => {
      this.relativeId = Number(relativeId);
    });
    this._mainService.currentPatientID.subscribe((patientId) => {
      this.patientId = Number(patientId);
      this.getPatientFamilyList();
    });
  }

  getPatientFamilyList(): void {
    this._relativeService
      .gitPatientFamilyMembersList(this.patientId)
      .subscribe({
        next: (response) => {
          this.patientFamilyList = response;
          console.log('family:', this.patientFamilyList);
        },
        error: (err) => {
          console.log('Faild to load patient family', err);
        },
      });
  }

  deleteFamilyMember(memberId: number): void {
    this._relativeService.deletePatientFamilyMember(memberId).subscribe({
      next: () => {
        this.showSuccess('Member deleted successfully!');
        this.getPatientFamilyList();
      },
      error: (err) => {
        console.error('Error deleting Member:', err);
        this.showError('Failed to delete Member.');
      },
    });
  }

  changeToAdd() {
    this.onEdit = false;
    this.memberForm.reset({
      name: '',
      relation: '',
      phoneNumber: '',
    });
    this.memberImage = null;
    this.memberaudio = null;
  }

  completeAddMember(): void {
    console.log('Form valid:', this.memberForm.valid);
    console.log('Image:', this.memberImage);
    console.log('Audio:', this.memberaudio);
    if (this.memberForm.valid && this.memberImage && this.memberaudio) {
      const formData = new FormData();
      formData.append('Name', this.memberForm.value.name);
      formData.append('Relation', this.memberForm.value.relation);
      formData.append('PhoneNumber', this.memberForm.value.phoneNumber);
      formData.append('PatientId', this.patientId.toString());
      formData.append('Image', this.memberImage as File);
      formData.append('Audio', this.memberaudio as File);

      this.addMember(formData);
    } else {
      this.memberForm.markAllAsTouched();
      this.showError('Please fill all required fields correctly.');
    }
  }

  addMember(formData: FormData): void {
    this._relativeService.addPatientFamilyMember(formData).subscribe({
      next: (response) => {
        console.log('Member added successfully:', response);
        this.getPatientFamilyList();
        this.showSuccess('Family member added successfully!');
        this.memberForm.reset({
          name: '',
          relation: '',
          phoneNumber: '',
        });
        this.memberImage = null;
        this.memberaudio = null;
        this.onEdit = false;
      },
      error: (err) => {
        console.error('Error adding member:', err);
        this.showError('Failed to add family member.');
      },
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent, type: 'audio' | 'image'): void {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0], type);
    }
  }

  onFileSelect(event: Event, type: 'audio' | 'image'): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.handleFile(input.files[0], type);
    }
  }

  handleFile(file: File, type: 'audio' | 'image'): void {
    // Validate file type
    console.log('File MIME type:', file.type); // check this in browser console

    if (!this.allowedImageTypes.includes(file.type) && type == 'image') {
      this.showError('Only JPG, JPEG, PNG files are allowed');
      return;
    }
    if (!this.allowedaudioTypes.includes(file.type) && type == 'audio') {
      this.showError('Only mp3 files are allowed');
      return;
    }
    // Validate file size
    if (file.size > this.maxFileSize) {
      console.log('File size must be less than 5MB');
      return;
    }
    // Save file
    if (type === 'image') {
      this.memberImage = file;
    } else if (type === 'audio') {
      this.memberaudio = file;
    } else {
      console.log('wrong file type');
    }
    console.log(file);
  }

  removeFile(type: 'audio' | 'image', event: Event): void {
    event.stopPropagation();
    if (type === 'image') {
      this.memberImage = null;
    }
    if (type === 'audio') {
      this.memberaudio = null;
    } else {
      console.log('No File TO Deleet');
    }
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }
  showError(message: string) {
    this.toastr.error(message);
  }
}

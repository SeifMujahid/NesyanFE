export interface Patients {}

export interface DoctorPatientsList {
  patientId: number;
  fullName: string;
  age: number;
  gender: string;
  currentStage: number;
  currentStageName: string;
}

export interface RelativePatientsList {
  patientId: number;
  fullName: string;
  age: number;
  gender: string;
  currentStage: number;
  currentStageName: string;
}

export interface PatientMedicationList {
  id: number;
  title: string;
  name: string;
  dosage: string;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
  isCompleted: boolean;
}

export interface AddMedicationData {
  type: number;
  title: string;
  name: string;
  dosage: string;
  frequency: number;
  reminderDate: string;
  reminderTime: string;
  notes: string;
}

export interface PatientRoutineList {
  id: number;
  title: string;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
  isCompleted: boolean;
}

export interface AddRoutineData {
  type: number;
  title: string;
  frequency: number;
  reminderDate: string;
  reminderTime: string;
  notes: string;
}

export interface PatientAppointmentList {
  id: number;
  title: string;
  name: string;
  specialty: any;
  location: any;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
  isCompleted: boolean;
}

export interface AddAppointmentData {
  type: number;
  title: string;
  name: string;
  specialty: any;
  location: any;
  reminderDate: string;
  reminderTime: string;
  frequency: number;
  notes: string;
}

export interface PatientFamilyList {
  id: number;
  name: string;
  relation: string;
  phoneNumber: string;
  imageUrl: string;
  audioUrl: string;
  patientId: number;
}

export interface PatientMindGamesList {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  level: string;
}

export interface AddMindGame {
  doctorId: number;
  startDate: string;
  frequency: string;
}

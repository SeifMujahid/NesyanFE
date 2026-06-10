export interface Relative {}

export interface RelativeProfile {
  id: number;
  nationalId: string;
  fName: string;
  lName: string;
  userName: string;
  email: string;
  phone: string;
  imageUrl: any;
  gender: string;
  country: string;
  city: string;
  age: number;
  patients: Patient[];
}

export interface Patient {
  patientId: number;
  fullName: string;
  age: number;
  gender: string;
  currentStage: number;
  currentStageName: string;
  phone: string;
  imageUrl: any;
  nearestReminder?: NearestReminder;
}

export interface NearestReminder {
  id: number;
  title: string;
  name?: string;
  dosage?: string;
  type: string;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
}

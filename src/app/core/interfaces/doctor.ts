export interface Doctor {}

export interface DoctorProfile {
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
  graduationDegree: string;
  medicalAssociationCard: string;
  specialization: string;
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
  nearestReminder: any;
}

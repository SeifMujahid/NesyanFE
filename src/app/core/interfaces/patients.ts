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

export interface PatientPeofile {
  id: number;
  nationalId: string;
  fName: string;
  lName: string;
  email: string;
  userName: string;
  age: number;
  gender: string;
  city: string;
  country: string;
  currentStage: number;
  currentStageName: string;
  height: number;
  weight: number;
  bloodType: string;
  phone: string;
  imageUrl: any;
  diseases: string[];
  doctor: Doctor;
  caregiver: any;
  relatives: Rela[];
  telemetries: Telemetry[];
  assessments: Assessment[];
  medications: Medication[];
  appointments: Appointment[];
  routines: Routine[];
  assignedGames: AssignedGame[];
}

export interface Doctor {
  id: number;
  fName: string;
  lName: string;
  fullName: string;
  phone: string;
  imageUrl: any;
  specialization: string;
}

export interface Rela {
  id: number;
  fName: string;
  lName: string;
  fullName: string;
  phone: string;
  imageUrl?: string;
}

export interface Telemetry {
  patientId: number;
  hr: number;
  spo2: number;
  steps: number;
  lat: number;
  lng: number;
  status: string;
  timestamp: string;
}

export interface Assessment {
  recognitionOfName: string;
  recognitionOfPlace: string;
  recognitionOfTime: string;
  abilityToConcentrate: string;
  recallOfRecentEvents: string;
  anxietyOrStress: string;
  depressionOrSadness: string;
  aggression: string;
  eatingAndDrinking: string;
  bathing: string;
  dressing: string;
  usingBathroom: string;
  mobility: string;
  notes: string;
}

export interface Medication {
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

export interface Appointment {
  id: number;
  title: string;
  name: string;
  specialty: string;
  location: string;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
  isCompleted: boolean;
}

export interface Routine {
  id: number;
  title: string;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
  isCompleted: boolean;
}

export interface AssignedGame {
  id: number;
  doctorId: number;
  patientId: number;
  mindGameId: number;
  mindGame: MindGame;
  addedDate: string;
  startDate: string;
  frequency: string;
}

export interface MindGame {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  level: string;
}

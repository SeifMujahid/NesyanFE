export interface TreatmentRequests {
  requestId: number;
  doctorSummary: DoctorSummary;
  relativeSummary: RelativeSummary;
  patientInfo: PatientInfo;
  status: string;
  notes: string;
}

export interface DoctorSummary {
  doctorId: number;
  fullName: string;
  age: number;
  gender: string;
  graduationDegree: string;
  medicalAssociationCard: string;
  specialization: string;
}

export interface RelativeSummary {
  relativeId: number;
  fullName: string;
  userName: string;
}

export interface PatientInfo {
  patientSummary: PatientSummary;
  patientMedical: PatientMedical;
  latestAssessment: LatestAssessment;
}

export interface PatientSummary {
  patientId: number;
  fullName: string;
  age: number;
  gender: string;
  currentStage: number;
  currentStageName: string;
}

export interface PatientMedical {
  height: number;
  weight: number;
  bloodType: number;
  chronicDisease: string;
}

export interface LatestAssessment {
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

export interface SendRequest {
  patientId: number;
  doctorId: number;
  relativeId: number;
}

export interface SendRequest2 {
  nationalIdDoctor: any;
  emailDoctor: any;
  patientId: number;
}
export interface SendRequest3 {
  nationalIdcaregavier: any;
  emailcaregavier: any;
  patientId: number;
}

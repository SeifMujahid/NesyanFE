export interface Caregiver {}

export interface CaregiverProfile {
  id: number;
  nationalId: string;
  fName: string;
  lName: string;
  userName: string;
  email: string;
  phone: string;
  imageUrl: string;
  gender: string;
  country: string;
  city: string;
  age: number;
  patients: any[];
}

export interface Report {
  patient_id: number;
  full_name: string;
  age: number;
  gender: string;
  chronic_disease: string;
  alzheimer_stage: string;
  blood_type: string;
  cognitive_prediction: CognitivePrediction;
  mind_games_statistics: MindGamesStatistics;
  routines_statistics: RoutinesStatistics;
  medications_statistics: MedicationsStatistics;
  telemetry_statistics: TelemetryStatistics;
}

export interface CognitivePrediction {
  is_available: boolean;
  message: string;
  prediction: string;
  confidence: number;
  risk_score: number;
  probabilities: Probabilities;
  alert: string;
  predicted_at: string;
}

export interface Probabilities {
  declining: number;
  improving: number;
  stable: number;
}

export interface MindGamesStatistics {
  total_assigned_games: number;
  total_sessions_completed: number;
  average_score: number;
  highest_score: number;
  assigned_games: AssignedGame[];
  recent_game_records: RecentGameRecord[];
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

export interface RecentGameRecord {
  id: number;
  patientId: number;
  patternLevel: string;
  dateTime: string;
  score: number;
  rounds: number;
  time: number;
}

export interface RoutinesStatistics {
  total_routines: number;
  completed_routines: number;
  adherence_rate: number;
  routines_list: RoutinesList[];
}

export interface RoutinesList {
  id: number;
  title: string;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
  isCompleted: boolean;
}

export interface MedicationsStatistics {
  total_medications: number;
  completed_medications: number;
  adherence_rate: number;
  medications_list: MedicationsList[];
}

export interface MedicationsList {
  id: number;
  title: string;
  reminderDate: string;
  reminderTime: string;
  frequency: string;
  notes: string;
  isCompleted: boolean;
}

export interface TelemetryStatistics {
  has_telemetry: boolean;
  average_heart_rate: number;
  latest_heart_rate: number;
  average_oxygen_level: number;
  latest_oxygen_level: number;
  latest_telemetry_time: string;
  total_steps_tracked: number;
}

export type Role = 'Admin' | 'Dokter Gigi' | 'Terapis Gigi' | 'Admin Staff';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  nik: string;
  medicalRecordNo: string;
  birthDate: string;
  gender: 'L' | 'P';
  address: string;
  phone: string;
  insurance: string;
  occupation: string;
  education: string;
  maritalStatus: string;
}

export interface OdontogramData {
  toothNumber: number;
  status: 'Normal' | 'Karies' | 'Tambalan' | 'Missing' | 'Impaksi' | 'Sisa Akar';
  notes?: string;
}

export interface DentalHygieneDiagnosis {
  need: string;
  cause: string[];
  signs: string[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  anamnesis: {
    chiefComplaint: string;
    presentIllness: string;
    pastIllness: string;
    allergies: string;
    medications: string;
  };
  clinicalExam: {
    extraOral: {
      lymphNodes: string;
      tmj: string;
      face: string;
    };
    intraOral: {
      gingiva: string;
      mucosa: string;
      tongue: string;
      plaqueCalculus: string;
    };
  };
  odontogram: OdontogramData[];
  indices: {
    dmft: number;
    ohis: number;
    cpitn: number;
    plaqueIndex: number;
  };
  diagnosis: string[];
  informedConsent?: {
    isAgreed: boolean;
    patientSignature: string; // base64 image
    doctorSignature: string; // base64 image
    date: string;
    witnessName?: string;
  };
  treatmentPlan: string;
  treatmentRecord: string;
  education: string;
  evaluation: string;
}

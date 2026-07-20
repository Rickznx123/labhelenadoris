export type ExternalPatient = {
  externalId: string;
  fullName: string;
  cpf: string;
  birthDate: string;
};

export type ExternalExam = {
  externalId: string;
  examType: string;
  status: "pending" | "completed";
  examDate: string;
};

export interface LaboratoryIntegrationGateway {
  listPatients(): Promise<ExternalPatient[]>;
  listPatientExams(externalPatientId: string): Promise<ExternalExam[]>;
  syncExamResult(externalExamId: string): Promise<void>;
}

import { LaboratoryIntegrationGateway } from "./types";

export class NullLaboratoryIntegrationGateway
  implements LaboratoryIntegrationGateway
{
  async listPatients() {
    return [];
  }

  async listPatientExams() {
    return [];
  }

  async syncExamResult() {
    return;
  }
}

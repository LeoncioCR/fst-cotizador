import type {
  CreateCompanyContactData,
  SettingsRepository,
} from "../ports/settings.repository";

export class CreateCompanyContactUseCase {
  constructor(private readonly repository: SettingsRepository) {}

  execute(data: CreateCompanyContactData) {
    return this.repository.createContact(data);
  }
}

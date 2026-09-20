import type {
  SettingsRepository,
  UpdateCompanySettingsData,
} from "../ports/settings.repository";

export class UpdateCompanySettingsUseCase {
  constructor(private readonly repository: SettingsRepository) {}

  execute(data: UpdateCompanySettingsData) {
    return this.repository.updateCompanySettings(data);
  }
}

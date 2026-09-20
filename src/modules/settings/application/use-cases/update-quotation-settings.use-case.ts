import type {
  SettingsRepository,
  UpdateQuotationSettingsData,
} from "../ports/settings.repository";

export class UpdateQuotationSettingsUseCase {
  constructor(private readonly repository: SettingsRepository) {}

  execute(data: UpdateQuotationSettingsData) {
    return this.repository.updateQuotationSettings(data);
  }
}

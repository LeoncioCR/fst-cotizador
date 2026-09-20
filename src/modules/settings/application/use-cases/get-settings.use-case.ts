import type { SettingsRepository } from "../ports/settings.repository";

export class GetSettingsUseCase {
  constructor(private readonly repository: SettingsRepository) {}

  async execute() {
    const [company, quotation, contacts] = await Promise.all([
      this.repository.getCompanySettings(),

      this.repository.getQuotationSettings(),

      this.repository.listContacts(),
    ]);

    return {
      company,
      quotation,
      contacts,
    };
  }
}

import type { SettingsRepository } from "../ports/settings.repository";

export class DeleteCompanyContactUseCase {
  constructor(private readonly repository: SettingsRepository) {}

  execute(id: string) {
    return this.repository.deleteContact(id);
  }
}

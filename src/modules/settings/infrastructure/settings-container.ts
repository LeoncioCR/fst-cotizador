import { CreateCompanyContactUseCase } from "../application/use-cases/create-company-contact.use-case";

import { DeleteCompanyContactUseCase } from "../application/use-cases/delete-company-contact.use-case";

import { GetSettingsUseCase } from "../application/use-cases/get-settings.use-case";

import { UpdateCompanySettingsUseCase } from "../application/use-cases/update-company-settings.use-case";

import { UpdateQuotationSettingsUseCase } from "../application/use-cases/update-quotation-settings.use-case";

import { DrizzleSettingsRepository } from "./drizzle-settings.repository";

function repository() {
  return new DrizzleSettingsRepository();
}

export function makeGetSettingsUseCase() {
  return new GetSettingsUseCase(repository());
}

export function makeUpdateCompanySettingsUseCase() {
  return new UpdateCompanySettingsUseCase(repository());
}

export function makeUpdateQuotationSettingsUseCase() {
  return new UpdateQuotationSettingsUseCase(repository());
}

export function makeCreateCompanyContactUseCase() {
  return new CreateCompanyContactUseCase(repository());
}

export function makeDeleteCompanyContactUseCase() {
  return new DeleteCompanyContactUseCase(repository());
}

export function makeSettingsRepository() {
  return repository();
}

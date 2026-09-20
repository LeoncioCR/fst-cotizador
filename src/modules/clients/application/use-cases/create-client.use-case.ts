import { ApplicationError } from "@/shared/errors/application-error";

import { normalizeDocumentNumber } from "../../domain/normalize-document";

import type {
  ClientRepository,
  CreateClientData,
} from "../ports/client.repository";

export class CreateClientUseCase {
  constructor(private readonly clients: ClientRepository) {}

  async execute(command: CreateClientData) {
    const documentNumber = normalizeDocumentNumber(command.documentNumber);

    const duplicate = await this.clients.findByDocument(
      command.documentType,
      documentNumber,
    );

    if (duplicate) {
      throw new ApplicationError(
        "Ya existe un cliente con este documento.",
        "CLIENT_DOCUMENT_ALREADY_EXISTS",
      );
    }

    return this.clients.create({
      ...command,

      documentNumber,
    });
  }
}

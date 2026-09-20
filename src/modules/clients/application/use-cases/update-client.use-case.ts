import { ApplicationError } from "@/shared/errors/application-error";

import { normalizeDocumentNumber } from "../../domain/normalize-document";

import type {
  ClientRepository,
  UpdateClientData,
} from "../ports/client.repository";

interface Command extends UpdateClientData {
  id: string;
}

export class UpdateClientUseCase {
  constructor(private readonly clients: ClientRepository) {}

  async execute(command: Command) {
    const current = await this.clients.findById(command.id);

    if (!current) {
      throw new ApplicationError("Cliente no encontrado.", "CLIENT_NOT_FOUND");
    }

    const documentNumber = normalizeDocumentNumber(command.documentNumber);

    const duplicate = await this.clients.findByDocument(
      command.documentType,
      documentNumber,
    );

    if (duplicate && duplicate.id !== command.id) {
      throw new ApplicationError(
        "Ya existe otro cliente con este documento.",
        "CLIENT_DOCUMENT_ALREADY_EXISTS",
      );
    }

    return this.clients.update(command.id, {
      ...command,

      documentNumber,
    });
  }
}

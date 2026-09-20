import { ApplicationError } from "@/shared/errors/application-error";

import type {
  ClientRepository,
  CreateClientContactData,
} from "../ports/client.repository";

export class CreateClientContactUseCase {
  constructor(private readonly clients: ClientRepository) {}

  async execute(command: CreateClientContactData) {
    const client = await this.clients.findById(command.clientId);

    if (!client) {
      throw new ApplicationError("Cliente no encontrado.", "CLIENT_NOT_FOUND");
    }

    return this.clients.createContact(command);
  }
}

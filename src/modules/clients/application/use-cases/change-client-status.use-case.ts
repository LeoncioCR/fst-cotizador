import { ApplicationError } from "@/shared/errors/application-error";

import type { ClientStatus } from "../../domain/client";

import type { ClientRepository } from "../ports/client.repository";

interface Command {
  id: string;

  status: ClientStatus;

  updatedBy: string;
}

export class ChangeClientStatusUseCase {
  constructor(private readonly clients: ClientRepository) {}

  async execute(command: Command) {
    const client = await this.clients.findById(command.id);

    if (!client) {
      throw new ApplicationError("Cliente no encontrado.", "CLIENT_NOT_FOUND");
    }

    await this.clients.changeStatus(
      command.id,
      command.status,
      command.updatedBy,
    );
  }
}

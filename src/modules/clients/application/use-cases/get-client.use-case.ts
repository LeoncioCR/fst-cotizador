import type { ClientRepository } from "../ports/client.repository";

export class GetClientUseCase {
  constructor(private readonly clients: ClientRepository) {}

  async execute(id: string) {
    const client = await this.clients.findById(id);

    if (!client) {
      return null;
    }

    const contacts = await this.clients.listContacts(id);

    return {
      client,
      contacts,
    };
  }
}

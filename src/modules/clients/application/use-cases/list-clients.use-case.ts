import type {
  ClientRepository,
  ClientListFilters,
} from "../ports/client.repository";

export class ListClientsUseCase {
  constructor(private readonly clients: ClientRepository) {}

  execute(filters: ClientListFilters) {
    return this.clients.findAll(filters);
  }
}

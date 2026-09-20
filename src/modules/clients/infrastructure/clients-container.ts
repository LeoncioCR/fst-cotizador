import { ChangeClientStatusUseCase } from "../application/use-cases/change-client-status.use-case";

import { CreateClientContactUseCase } from "../application/use-cases/create-client-contact.use-case";

import { CreateClientUseCase } from "../application/use-cases/create-client.use-case";

import { GetClientUseCase } from "../application/use-cases/get-client.use-case";

import { ListClientsUseCase } from "../application/use-cases/list-clients.use-case";

import { UpdateClientUseCase } from "../application/use-cases/update-client.use-case";

import { DrizzleClientRepository } from "./drizzle-client.repository";

function repository() {
  return new DrizzleClientRepository();
}

export function makeListClientsUseCase() {
  return new ListClientsUseCase(repository());
}

export function makeGetClientUseCase() {
  return new GetClientUseCase(repository());
}

export function makeCreateClientUseCase() {
  return new CreateClientUseCase(repository());
}

export function makeUpdateClientUseCase() {
  return new UpdateClientUseCase(repository());
}

export function makeChangeClientStatusUseCase() {
  return new ChangeClientStatusUseCase(repository());
}

export function makeCreateClientContactUseCase() {
  return new CreateClientContactUseCase(repository());
}

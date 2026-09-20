export {
  makeListClientsUseCase,
  makeGetClientUseCase,
  makeCreateClientUseCase,
  makeUpdateClientUseCase,
  makeChangeClientStatusUseCase,
  makeCreateClientContactUseCase,
} from "./infrastructure/clients-container";

export type {
  Client,
  ClientType,
  ClientDocumentType,
  ClientStatus,
} from "./domain/client";

export type { ClientContact } from "./domain/client-contact";

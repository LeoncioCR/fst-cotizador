import type {
  Client,
  ClientDocumentType,
  ClientStatus,
  ClientType,
} from "../../domain/client";

import type { ClientContact } from "../../domain/client-contact";

export interface ClientListFilters {
  search?: string;

  type?: ClientType;

  status?: ClientStatus;

  page: number;

  pageSize: number;
}

export interface ClientListResult {
  items: Client[];

  total: number;

  page: number;

  pageSize: number;

  totalPages: number;
}

export interface CreateClientData {
  type: ClientType;

  documentType: ClientDocumentType;

  documentNumber: string;

  name: string;

  commercialName: string | null;

  address: string | null;

  notes: string | null;

  createdBy: string;
}

export interface UpdateClientData {
  type: ClientType;

  documentType: ClientDocumentType;

  documentNumber: string;

  name: string;

  commercialName: string | null;

  address: string | null;

  notes: string | null;

  updatedBy: string;
}

export interface CreateClientContactData {
  clientId: string;

  fullName: string;

  position: string | null;

  email: string | null;

  phone: string | null;

  whatsapp: string | null;

  isPrimary: boolean;

  createdBy: string;
}

export interface ClientRepository {
  findAll(filters: ClientListFilters): Promise<ClientListResult>;

  findById(id: string): Promise<Client | null>;

  findByDocument(
    type: ClientDocumentType,
    number: string,
  ): Promise<Client | null>;

  create(data: CreateClientData): Promise<Client>;

  update(id: string, data: UpdateClientData): Promise<Client>;

  changeStatus(
    id: string,
    status: ClientStatus,
    updatedBy: string,
  ): Promise<void>;

  listContacts(clientId: string): Promise<ClientContact[]>;

  createContact(data: CreateClientContactData): Promise<ClientContact>;

  changeContactStatus(
    contactId: string,
    isActive: boolean,
    updatedBy: string,
  ): Promise<void>;
}

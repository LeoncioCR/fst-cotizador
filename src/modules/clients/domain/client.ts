export type ClientType = "natural" | "juridica";

export type ClientDocumentType = "dni" | "ruc";

export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;

  type: ClientType;

  documentType: ClientDocumentType;

  documentNumber: string;

  name: string;

  commercialName: string | null;

  address: string | null;

  notes: string | null;

  status: ClientStatus;

  createdAt: Date;

  updatedAt: Date;
}

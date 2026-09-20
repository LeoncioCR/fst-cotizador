import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";

import { db } from "@/infrastructure/database";

import { clientContacts, clients } from "@/infrastructure/database/schema";

import type {
  ClientRepository,
  ClientListFilters,
  CreateClientData,
  UpdateClientData,
  CreateClientContactData,
} from "../application/ports/client.repository";

import type { ClientStatus } from "../domain/client";

export class DrizzleClientRepository implements ClientRepository {
  async findAll(filters: ClientListFilters) {
    const conditions = [];

    if (filters.search) {
      const search = `%${filters.search.trim()}%`;

      conditions.push(
        or(
          ilike(clients.name, search),

          ilike(clients.documentNumber, search),

          ilike(clients.commercialName, search),
        ),
      );
    }

    if (filters.type) {
      conditions.push(eq(clients.type, filters.type));
    }

    if (filters.status) {
      conditions.push(eq(clients.status, filters.status));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (filters.page - 1) * filters.pageSize;

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(clients)
        .where(where)
        .orderBy(desc(clients.createdAt))
        .limit(filters.pageSize)
        .offset(offset),

      db
        .select({
          total: count(),
        })
        .from(clients)
        .where(where),
    ]);

    const total = totalResult[0]?.total ?? 0;

    return {
      items: rows,

      total,

      page: filters.page,

      pageSize: filters.pageSize,

      totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
    };
  }

  async findById(id: string) {
    const [row] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    return row ?? null;
  }

  async findByDocument(
    type: "dni" | "ruc",

    number: string,
  ) {
    const [row] = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.documentType, type),

          eq(clients.documentNumber, number),
        ),
      )
      .limit(1);

    return row ?? null;
  }

  async create(data: CreateClientData) {
    const [client] = await db
      .insert(clients)
      .values({
        type: data.type,

        documentType: data.documentType,

        documentNumber: data.documentNumber,

        name: data.name,

        commercialName: data.commercialName,

        address: data.address,

        notes: data.notes,

        createdBy: data.createdBy,

        updatedBy: data.createdBy,
      })
      .returning();

    return client;
  }

  async update(id: string, data: UpdateClientData) {
    const [client] = await db
      .update(clients)
      .set({
        type: data.type,

        documentType: data.documentType,

        documentNumber: data.documentNumber,

        name: data.name,

        commercialName: data.commercialName,

        address: data.address,

        notes: data.notes,

        updatedBy: data.updatedBy,

        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
      .returning();

    return client;
  }

  async changeStatus(id: string, status: ClientStatus, updatedBy: string) {
    await db
      .update(clients)
      .set({
        status,

        updatedBy,

        updatedAt: new Date(),
      })
      .where(eq(clients.id, id));
  }

  async listContacts(clientId: string) {
    return db
      .select()
      .from(clientContacts)
      .where(eq(clientContacts.clientId, clientId))
      .orderBy(
        desc(clientContacts.isPrimary),

        asc(clientContacts.fullName),
      );
  }

  async createContact(data: CreateClientContactData) {
    return db.transaction(async (tx) => {
      /*
       * Si será principal,
       * retiramos el principal anterior.
       */
      if (data.isPrimary) {
        await tx
          .update(clientContacts)
          .set({
            isPrimary: false,

            updatedAt: new Date(),
          })
          .where(
            and(
              eq(clientContacts.clientId, data.clientId),

              eq(clientContacts.isPrimary, true),
            ),
          );
      }

      const [contact] = await tx
        .insert(clientContacts)
        .values({
          clientId: data.clientId,

          fullName: data.fullName,

          position: data.position,

          email: data.email,

          phone: data.phone,

          whatsapp: data.whatsapp,

          isPrimary: data.isPrimary,

          createdBy: data.createdBy,

          updatedBy: data.createdBy,
        })
        .returning();

      return contact;
    });
  }

  async changeContactStatus(
    contactId: string,
    isActive: boolean,
    updatedBy: string,
  ) {
    await db
      .update(clientContacts)
      .set({
        isActive,

        /*
         * Un contacto inactivo
         * no debe seguir siendo principal.
         */
        ...(!isActive
          ? {
              isPrimary: false,
            }
          : {}),

        updatedBy,

        updatedAt: new Date(),
      })
      .where(eq(clientContacts.id, contactId));
  }
}

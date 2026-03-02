import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import type { LeadFiltersInput } from "@/schemas/admin/lead-admin";

import { prisma } from "@/lib/db/prisma";

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string | null;
  message: string;
  source: "CONTACT_FORM" | "BUDGET_FORM";
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST";
  createdAt: Date;
  updatedAt: Date;
};

type LeadNoteRow = {
  id: string;
  leadId: string;
  note: string;
  authorEmail: string | null;
  createdAt: Date;
};

export type AdminLeadDto = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
  source: "CONTACT_FORM" | "BUDGET_FORM";
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST";
  createdAt: string;
  updatedAt: string;
  notes: {
    id: string;
    note: string;
    authorEmail?: string;
    createdAt: string;
  }[];
};

const toLeadDto = (lead: LeadRow, notes: LeadNoteRow[]): AdminLeadDto => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  phone: lead.phone || undefined,
  projectType: lead.projectType || undefined,
  message: lead.message,
  source: lead.source,
  status: lead.status,
  createdAt: lead.createdAt.toISOString(),
  updatedAt: lead.updatedAt.toISOString(),
  notes: notes.map((note) => ({
    id: note.id,
    note: note.note,
    authorEmail: note.authorEmail || undefined,
    createdAt: note.createdAt.toISOString(),
  })),
});

const buildWhereSql = (filters: LeadFiltersInput) => {
  const conditions: Prisma.Sql[] = [];

  if (filters.dateFrom) {
    conditions.push(Prisma.sql`l."createdAt" >= ${new Date(filters.dateFrom)}`);
  }
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    conditions.push(Prisma.sql`l."createdAt" <= ${toDate}`);
  }
  if (filters.status) {
    conditions.push(Prisma.sql`l."status" = ${filters.status}::"public"."LeadStatus"`);
  }
  if (filters.service) {
    const like = `%${filters.service}%`;
    conditions.push(Prisma.sql`COALESCE(l."projectType",'') ILIKE ${like}`);
  }
  if (filters.q) {
    const like = `%${filters.q}%`;
    conditions.push(
      Prisma.sql`(l."name" ILIKE ${like} OR l."email" ILIKE ${like} OR l."message" ILIKE ${like})`,
    );
  }

  if (conditions.length === 0) {
    return Prisma.sql`TRUE`;
  }

  return Prisma.join(conditions, " AND ");
};

const fetchLeadNotes = async (leadIds: string[]) => {
  if (leadIds.length === 0) {
    return [] as LeadNoteRow[];
  }
  return prisma.$queryRaw<LeadNoteRow[]>(Prisma.sql`
    SELECT "id", "leadId", "note", "authorEmail", "createdAt"
    FROM "public"."LeadNote"
    WHERE "leadId" IN (${Prisma.join(leadIds)})
    ORDER BY "createdAt" DESC
  `);
};

export const listAdminLeads = async (filters: LeadFiltersInput = {}): Promise<AdminLeadDto[]> => {
  const whereSql = buildWhereSql(filters);
  const leads = await prisma.$queryRaw<LeadRow[]>(Prisma.sql`
    SELECT
      l."id", l."name", l."email", l."phone", l."projectType",
      l."message", l."source", l."status", l."createdAt", l."updatedAt"
    FROM "public"."Lead" l
    WHERE ${whereSql}
    ORDER BY l."createdAt" DESC
    LIMIT 1000
  `);

  const notes = await fetchLeadNotes(leads.map((lead) => lead.id));
  const notesByLead = notes.reduce<Record<string, LeadNoteRow[]>>((acc, note) => {
    if (!acc[note.leadId]) {
      acc[note.leadId] = [];
    }
    acc[note.leadId].push(note);
    return acc;
  }, {});

  return leads.map((lead) => toLeadDto(lead, notesByLead[lead.id] || []));
};

export const updateLeadStatus = async (params: {
  leadId: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST";
  note?: string;
  authorEmail?: string;
}) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw(Prisma.sql`
      UPDATE "public"."Lead"
      SET "status" = ${params.status}::"public"."LeadStatus", "updatedAt" = NOW()
      WHERE "id" = ${params.leadId}
    `);

    if (params.note) {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "public"."LeadNote" ("id", "leadId", "note", "authorEmail")
        VALUES (${randomUUID()}, ${params.leadId}, ${params.note}, ${params.authorEmail ?? null})
      `);
    }
  });
};

const csvEscape = (value: string) => {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const buildLeadsCsv = (leads: AdminLeadDto[]) => {
  const header = [
    "id",
    "name",
    "email",
    "phone",
    "service",
    "status",
    "source",
    "createdAt",
    "lastNote",
  ];
  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone || "",
    lead.projectType || "",
    lead.status,
    lead.source,
    lead.createdAt,
    lead.notes[0]?.note || "",
  ]);

  return [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");
};

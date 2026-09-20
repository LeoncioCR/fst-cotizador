export function normalizeDocumentNumber(value: string): string {
  return value.replace(/\D/g, "").trim();
}

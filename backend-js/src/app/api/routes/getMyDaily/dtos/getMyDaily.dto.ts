import { ValidationError } from "@/app/lib/errors";

export function validateGetMyDailyDto(searchParams: URLSearchParams): string {
  const date = searchParams.get("date");

  if (date !== null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ValidationError("date must be in YYYY-MM-DD format");
    }
    return date;
  }

  return new Date().toISOString().slice(0, 10);
}

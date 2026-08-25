import { randomBytes } from "crypto";

// Avoids visually ambiguous characters (0/O, 1/I/L) since these are meant to
// be read off a list and typed into a form by a real person.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomSegment(length: number): string {
  return Array.from(randomBytes(length), (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function generatePartnerCode(): string {
  return `PL-${randomSegment(4)}-${randomSegment(4)}-${randomSegment(4)}`;
}

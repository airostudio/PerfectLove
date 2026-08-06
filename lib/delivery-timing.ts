export const STANDARD_DELAY_MS = 24 * 60 * 60 * 1000; // 24 hours
export const EXPRESS_DELAY_MS = 30 * 60 * 1000; // 30 minutes

export function computeDeliveryAt(deliveryType: "standard" | "express"): string {
  const delayMs = deliveryType === "express" ? EXPRESS_DELAY_MS : STANDARD_DELAY_MS;
  return new Date(Date.now() + delayMs).toISOString();
}

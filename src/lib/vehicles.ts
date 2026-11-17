export const VEHICLE_TYPES = [
  "passenger_car",
  "suv",
  "pickup",
  "van",
  "motorcycle",
  "heavy",
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export function isVehicleType(value: string): value is VehicleType {
  return (VEHICLE_TYPES as readonly string[]).includes(value);
}

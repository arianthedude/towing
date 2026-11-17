"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () =>
    import("@/components/public/location-map").then((m) => m.LocationMap),
  { ssr: false },
);

export function StaticLocationMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <LocationMap lat={lat} lng={lng} onPick={() => {}} />
  );
}

"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import type { Service } from "@prisma/client";
import { X, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitRequest, type ActionResult } from "@/app/actions/requests";
import { formatPricingLabel } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { VEHICLE_TYPES } from "@/lib/vehicles";
import { pickLocalized } from "@/lib/data-client";
import { cn } from "@/lib/utils";

const LocationMap = dynamic(
  () =>
    import("@/components/public/location-map").then((m) => m.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500">
        …
      </div>
    ),
  },
);

function interpolate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}

export function RequestForm({
  locale,
  dict,
  services,
  phone,
  open,
  onOpenChange,
}: {
  locale: Locale;
  dict: Dictionary;
  services: Service[];
  phone: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    submitRequest,
    null,
  );

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const success = state?.ok === true;

  const errorMessage = useMemo(() => {
    if (!state || state.ok) return null;
    if (state.error === "rate_limit") return dict.request.errorRateLimit;
    if (state.error === "validation") return dict.request.errorValidation;
    return dict.request.errorGeneric;
  }, [state, dict]);

  function useGps() {
    if (!navigator.geolocation) {
      alert(dict.request.step3.gpsUnsupported);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => alert(dict.request.step3.gpsDenied),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  if (!open) return null;

  return (
    <dialog ref={dialogRef} aria-labelledby="request-dialog-title" onCancel={() => onOpenChange(false)} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-black/60 p-0 text-zinc-900 backdrop:bg-transparent">
      <div className="mx-auto flex h-full max-w-lg flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div>
            <h2 id="request-dialog-title" className="font-bold text-zinc-900">{dict.request.title}</h2>
            {!success && (
              <p className="text-xs text-zinc-500">
                {interpolate(dict.request.stepOf, {
                  current: step,
                  total: 4,
                })}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={dict.request.close}
            className="rounded-md p-1 hover:bg-zinc-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {success ? (
            <div className="space-y-4 py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
              <h2 className="text-xl font-bold">{dict.request.successTitle}</h2>
              <p className="text-zinc-600">{dict.request.successBody}</p>
              <a
                href={`tel:${phone}`}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-red-700 font-bold text-white"
              >
                {phone}
              </a>
            </div>
          ) : (
            <form
              action={(fd) => {
                fd.set("serviceId", serviceId);
                fd.set("vehicleType", vehicleType);
                fd.set("latitude", lat?.toString() ?? "");
                fd.set("longitude", lng?.toString() ?? "");
                fd.set("locale", locale);
                startTransition(() => formAction(fd));
              }}
              className="space-y-4"
            >
              {/* honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

              {step === 1 && (
                <section>
                  <h2 className="mb-1 text-lg font-bold">
                    {dict.request.step1.title}
                  </h2>
                  <p className="mb-3 text-sm text-zinc-500">
                    {dict.request.step1.hint}
                  </p>
                  <div className="space-y-2">
                    {services.map((s) => {
                      const title = pickLocalized(s, locale, "titleFa", "titleEn");
                      const pricing = formatPricingLabel(
                        s.pricingType,
                        s.basePrice,
                        s.pricePerKilometer,
                        locale,
                        dict.services.pricing,
                      );
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className={cn(
                            "w-full rounded-xl border-2 px-4 py-3 text-start transition",
                            serviceId === s.id
                              ? "border-amber-400 bg-amber-50"
                              : "border-zinc-800 hover:bg-amber-50",
                          )}
                          onClick={() => {
                            setServiceId(s.id);
                            setStep(2);
                          }}
                        >
                          <span className="block font-bold">{title}</span>
                          <span className="block text-sm text-zinc-600">
                            {pricing}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {step === 2 && (
                <section>
                  <h2 className="mb-3 text-lg font-bold">
                    {dict.request.step2.title}
                  </h2>
                  <div className="space-y-2">
                    {VEHICLE_TYPES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        className={cn(
                          "w-full rounded-xl border-2 px-4 py-3 text-start font-medium transition",
                          vehicleType === v
                            ? "border-amber-400 bg-amber-50"
                            : "border-zinc-800 hover:bg-amber-50",
                        )}
                        onClick={() => {
                          setVehicleType(v);
                          setStep(3);
                        }}
                      >
                        {dict.vehicles[v]}
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4 w-full"
                    onClick={() => setStep(1)}
                  >
                    {dict.request.back}
                  </Button>
                </section>
              )}

              {step === 3 && (
                <section>
                  <h2 className="mb-3 text-lg font-bold">
                    {dict.request.step3.title}
                  </h2>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mb-3 w-full"
                    onClick={useGps}
                  >
                    <MapPin className="h-4 w-4" />
                    {dict.request.step3.useGps}
                  </Button>
                  <LocationMap
                    lat={lat}
                    lng={lng}
                    onPick={(a, b) => {
                      setLat(a);
                      setLng(b);
                    }}
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    {dict.request.step3.mapHint}
                  </p>
                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => setStep(4)}
                    >
                      {dict.request.continue}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => setStep(2)}
                    >
                      {dict.request.back}
                    </Button>
                  </div>
                </section>
              )}

              {step === 4 && (
                <section className="space-y-3">
                  <h2 className="text-lg font-bold">{dict.request.step4.title}</h2>
                  <div>
                    <Label htmlFor="name">{dict.request.step4.name}</Label>
                    <Input
                      id="name"
                      name="customerName"
                      required
                      maxLength={80}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{dict.request.step4.phone}</Label>
                    <Input
                      id="phone"
                      name="phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={14}
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">{dict.request.step4.address}</Label>
                    <Textarea
                      id="address"
                      name="address"
                      required
                      maxLength={400}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="note">{dict.request.step4.note}</Label>
                    <Textarea id="note" name="note" maxLength={400} rows={2} />
                  </div>
                  {errorMessage && (
                    <p className="text-sm font-medium text-red-700">
                      {errorMessage}
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? dict.request.submitting : dict.request.submit}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setStep(3)}
                  >
                    {dict.request.back}
                  </Button>
                </section>
              )}
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@prisma/client";
import { saveServiceAction, deleteServiceAction } from "@/app/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/types";

export function ServiceForm({
  service,
  dict,
}: {
  service?: Service;
  dict: Dictionary;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const t = dict.admin.servicesAdmin;

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="font-bold">{service ? t.edit : t.add}</h2>
      <form
        className="grid gap-3 sm:grid-cols-2"
        action={(fd) => {
          startTransition(async () => {
            await saveServiceAction(service?.id ?? null, fd);
            router.refresh();
          });
        }}
      >
        <div className="sm:col-span-2">
          <Label>{t.slug}</Label>
          <Input name="slug" defaultValue={service?.slug ?? ""} required />
        </div>
        <div>
          <Label>{t.titleFa}</Label>
          <Input name="titleFa" defaultValue={service?.titleFa ?? ""} required />
        </div>
        <div>
          <Label>{t.titleEn}</Label>
          <Input name="titleEn" defaultValue={service?.titleEn ?? ""} required />
        </div>
        <div>
          <Label>{t.descFa}</Label>
          <Textarea
            name="descriptionFa"
            defaultValue={service?.descriptionFa ?? ""}
            required
          />
        </div>
        <div>
          <Label>{t.descEn}</Label>
          <Textarea
            name="descriptionEn"
            defaultValue={service?.descriptionEn ?? ""}
            required
          />
        </div>
        <div>
          <Label>{t.pricingType}</Label>
          <select
            name="pricingType"
            defaultValue={service?.pricingType ?? "FIXED"}
            className="h-11 w-full rounded-lg border-2 border-zinc-300 bg-white px-3"
          >
            <option value="FIXED">FIXED</option>
            <option value="PER_KILOMETER">PER_KILOMETER</option>
            <option value="NEGOTIABLE">NEGOTIABLE</option>
          </select>
        </div>
        <div>
          <Label>{t.sortOrder}</Label>
          <Input
            name="sortOrder"
            type="number"
            defaultValue={service?.sortOrder ?? 0}
          />
        </div>
        <div>
          <Label>{t.basePrice}</Label>
          <Input
            name="basePrice"
            type="number"
            defaultValue={service?.basePrice ?? ""}
          />
        </div>
        <div>
          <Label>{t.pricePerKm}</Label>
          <Input
            name="pricePerKilometer"
            type="number"
            defaultValue={service?.pricePerKilometer ?? ""}
          />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={service?.isActive ?? true}
          />
          {t.active}
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {dict.common.save}
          </Button>
        </div>
      </form>

      {service && (
        <form
          action={() => {
            if (!confirm(t.confirmDelete)) return;
            startTransition(async () => {
              await deleteServiceAction(service.id);
              router.refresh();
            });
          }}
        >
          <Button type="submit" variant="destructive" disabled={pending}>
            {dict.admin.table.delete}
          </Button>
        </form>
      )}
    </div>
  );
}

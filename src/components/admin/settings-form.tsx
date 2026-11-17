"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { BusinessSettings } from "@prisma/client";
import { saveSettingsAction } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/types";

export function SettingsForm({
  settings,
  dict,
}: {
  settings: BusinessSettings;
  dict: Dictionary;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const t = dict.admin.settingsAdmin;

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      action={(fd) => {
        startTransition(async () => {
          await saveSettingsAction(fd);
          router.refresh();
        });
      }}
    >
      <div>
        <Label>{t.nameFa}</Label>
        <Input name="businessNameFa" defaultValue={settings.businessNameFa} required />
      </div>
      <div>
        <Label>{t.nameEn}</Label>
        <Input name="businessNameEn" defaultValue={settings.businessNameEn} required />
      </div>
      <div>
        <Label>{t.phone}</Label>
        <Input name="phoneNumber" defaultValue={settings.phoneNumber} required />
      </div>
      <div>
        <Label>{t.secondaryPhone}</Label>
        <Input
          name="secondaryPhoneNumber"
          defaultValue={settings.secondaryPhoneNumber ?? ""}
        />
      </div>
      <div>
        <Label>{t.descFa}</Label>
        <Textarea name="descriptionFa" defaultValue={settings.descriptionFa} required />
      </div>
      <div>
        <Label>{t.descEn}</Label>
        <Textarea name="descriptionEn" defaultValue={settings.descriptionEn} required />
      </div>
      <div>
        <Label>{t.heroTitleFa}</Label>
        <Input name="heroTitleFa" defaultValue={settings.heroTitleFa} required />
      </div>
      <div>
        <Label>{t.heroTitleEn}</Label>
        <Input name="heroTitleEn" defaultValue={settings.heroTitleEn} required />
      </div>
      <div>
        <Label>{t.heroDescFa}</Label>
        <Textarea
          name="heroDescriptionFa"
          defaultValue={settings.heroDescriptionFa}
          required
        />
      </div>
      <div>
        <Label>{t.heroDescEn}</Label>
        <Textarea
          name="heroDescriptionEn"
          defaultValue={settings.heroDescriptionEn}
          required
        />
      </div>
      <div>
        <Label>{t.address}</Label>
        <Input name="address" defaultValue={settings.address ?? ""} />
      </div>
      <div>
        <Label>{t.websiteUrl}</Label>
        <Input name="websiteUrl" defaultValue={settings.websiteUrl ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? dict.common.saving : dict.common.save}
        </Button>
      </div>
    </form>
  );
}

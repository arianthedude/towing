"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteRequestAction,
  updateRequestAction,
} from "@/app/actions/requests";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Dictionary } from "@/lib/i18n/types";
import type { RequestStatus } from "@prisma/client";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export function RequestDetailForm({
  id,
  status,
  adminNote,
  dict,
  locale,
}: {
  id: string;
  status: RequestStatus;
  adminNote: string | null;
  dict: Dictionary;
  locale: Locale;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <form
        action={(fd) => {
          startTransition(async () => {
            await updateRequestAction(id, fd);
            router.refresh();
          });
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="status">{dict.admin.table.status}</Label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="mt-1 h-11 w-full rounded-lg border-2 border-zinc-300 bg-white px-3"
          >
            {(
              ["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as RequestStatus[]
            ).map((s) => (
              <option key={s} value={s}>
                {dict.status[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="adminNote">{dict.admin.table.adminNote}</Label>
          <Textarea
            id="adminNote"
            name="adminNote"
            defaultValue={adminNote ?? ""}
            rows={3}
          />
        </div>
        <Button type="submit" disabled={pending}>
          {dict.admin.table.save}
        </Button>
      </form>

      <form
        action={() => {
          if (!confirm(dict.admin.table.confirmDelete)) return;
          startTransition(async () => {
            await deleteRequestAction(id);
            router.push(localizedPath(locale, "/admin/requests"));
          });
        }}
      >
        <Button type="submit" variant="destructive" disabled={pending}>
          {dict.admin.table.delete}
        </Button>
      </form>
    </div>
  );
}

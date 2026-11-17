"use client";

import { useActionState } from "react";
import { loginAction, type LoginResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export function LoginForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const action = loginAction.bind(null, locale);
  const [state, formAction, pending] = useActionState<LoginResult, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="username">{dict.admin.username}</Label>
        <Input id="username" name="username" autoComplete="username" required />
      </div>
      <div>
        <Label htmlFor="password">{dict.admin.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state && !state.ok && (
        <p className="text-sm font-medium text-red-700">
          {dict.admin.invalidCredentials}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {dict.admin.login}
      </Button>
    </form>
  );
}

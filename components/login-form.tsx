"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/(auth)/admin/login/actions";
import { Button } from "@/components/ui/button";

const initial: LoginState = { error: "" };

const fieldClass =
  "h-9 w-full rounded-none border bg-transparent px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="index-num mb-2 block">邮箱</label>
        <input id="email" name="email" type="email" required className={fieldClass} style={{ borderColor: "var(--border)" }} placeholder="admin@starrudder.dev" />
      </div>
      <div>
        <label htmlFor="password" className="index-num mb-2 block">密码</label>
        <input id="password" name="password" type="password" required className={fieldClass} style={{ borderColor: "var(--border)" }} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" loading={pending} className="rounded-none">登录后台</Button>
    </form>
  );
}

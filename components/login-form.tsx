"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initial: LoginState = { error: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="index-num mb-2 block">邮箱</label>
        <Input id="email" name="email" type="email" required className="rounded-none" placeholder="admin@starrudder.dev" />
      </div>
      <div>
        <label htmlFor="password" className="index-num mb-2 block">密码</label>
        <Input id="password" name="password" type="password" required className="rounded-none" />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" loading={pending} className="rounded-none">登录后台</Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLink, type SubmitState } from "@/app/submit/actions";

const initialState: SubmitState = { ok: false, message: "" };

const fieldClass =
  "h-9 w-full rounded-none border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitLink, initialState);

  return (
    <form action={formAction} className="mt-7 max-w-xl space-y-5">
      <div>
        <label htmlFor="type" className="index-num mb-2 block">提交类型</label>
        <select id="type" name="type" defaultValue="site" className={fieldClass} style={{ borderColor: "var(--border)" }}>
          <option value="site">站点导航</option>
          <option value="link">友情链接</option>
        </select>
      </div>
      <div>
        <label htmlFor="name" className="index-num mb-2 block">名称</label>
        <Input id="name" name="name" required placeholder="站点或网站名称" className={fieldClass} style={{ borderColor: "var(--border)" }} />
      </div>
      <div>
        <label htmlFor="url" className="index-num mb-2 block">网址</label>
        <Input id="url" name="url" required placeholder="https://example.com" className={fieldClass} style={{ borderColor: "var(--border)" }} />
      </div>
      <div>
        <label htmlFor="description" className="index-num mb-2 block">简介</label>
        <Textarea id="description" name="description" rows={3} placeholder="一句话介绍这个站点" className={`${fieldClass} h-auto py-2`} style={{ borderColor: "var(--border)" }} />
      </div>
      <div>
        <label htmlFor="email" className="index-num mb-2 block">邮箱（选填）</label>
        <Input id="email" name="email" type="email" placeholder="用于接收审核结果" className={fieldClass} style={{ borderColor: "var(--border)" }} />
      </div>

      {state.message && (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {state.message}
        </p>
      )}

      <Button type="submit" loading={pending} className="rounded-none">提交坐标</Button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLink, type SubmitState } from "@/app/submit/actions";

const initialState: SubmitState = { ok: false, message: "" };

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitLink, initialState);

  return (
    <form action={formAction} className="mt-10 max-w-xl space-y-5">
      <div>
        <label htmlFor="type" className="mb-2 block text-sm font-medium">提交类型</label>
        <select
          id="type"
          name="type"
          defaultValue="site"
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          <option value="site">站点导航</option>
          <option value="link">友情链接</option>
        </select>
      </div>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">名称</label>
        <Input id="name" name="name" required placeholder="站点或网站名称" />
      </div>
      <div>
        <label htmlFor="url" className="mb-2 block text-sm font-medium">网址</label>
        <Input id="url" name="url" required placeholder="https://example.com" />
      </div>
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium">简介</label>
        <Textarea id="description" name="description" rows={3} placeholder="一句话介绍这个站点" />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">邮箱（选填）</label>
        <Input id="email" name="email" type="email" placeholder="用于接收审核结果" />
      </div>

      {state.message && (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {state.message}
        </p>
      )}

      <Button type="submit" loading={pending}>
        提交申请
      </Button>
    </form>
  );
}

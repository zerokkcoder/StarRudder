"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";

export function FormDialog({
  title,
  trigger,
  variant = "default",
  children,
}: {
  title: string;
  trigger: ReactNode;
  variant?: "default" | "outline" | "ghost";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant={variant} size="xs" onClick={() => setOpen(true)} className="rounded-none">
        {trigger}
      </Button>
      <DialogPopup className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            填写后提交，保存即生效。
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-5 pt-4 pb-5">{children}</div>
      </DialogPopup>
    </Dialog>
  );
}

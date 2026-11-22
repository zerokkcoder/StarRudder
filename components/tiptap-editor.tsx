"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { ReactNode } from "react";

function Tool({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`min-w-8 border px-2 py-1 text-xs transition-colors ${
        active ? "border-primary bg-accent text-primary" : "hover:border-primary hover:text-primary"
      }`}
      style={{ borderColor: active ? undefined : "var(--border)" }}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-rudder min-h-64 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="min-h-64 border p-4 text-sm text-muted-foreground" style={{ borderColor: "var(--border)" }}>
        正在载入编辑器…
      </div>
    );
  }

  return (
    <div className="border" style={{ borderColor: "var(--border)" }}>
      <div className="flex flex-wrap items-center gap-1.5 border-b p-2" style={{ borderColor: "var(--border)" }}>
        <Tool label="加粗" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </Tool>
        <Tool label="斜体" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </Tool>
        <span className="mx-1 h-4 w-px" style={{ background: "var(--border)" }} />
        <Tool label="二级标题" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Tool>
        <Tool label="三级标题" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Tool>
        <span className="mx-1 h-4 w-px" style={{ background: "var(--border)" }} />
        <Tool label="无序列表" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </Tool>
        <Tool label="有序列表" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </Tool>
        <Tool label="引用" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          ❝
        </Tool>
        <Tool label="代码块" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          &lt;/&gt;
        </Tool>
      </div>
      <EditorContent editor={editor} className="p-4 text-sm" />
    </div>
  );
}

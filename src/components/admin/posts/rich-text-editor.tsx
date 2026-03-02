"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (next: string) => void;
};

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-48 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none prose prose-zinc max-w-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-48 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
        Carregando editor...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded border px-2 py-1 text-xs ${
            editor.isActive("bold") ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300"
          }`}
        >
          Negrito
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded border px-2 py-1 text-xs ${
            editor.isActive("italic") ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300"
          }`}
        >
          Italico
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded border px-2 py-1 text-xs ${
            editor.isActive("heading", { level: 2 })
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-300"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded border px-2 py-1 text-xs ${
            editor.isActive("bulletList")
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-300"
          }`}
        >
          Lista
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

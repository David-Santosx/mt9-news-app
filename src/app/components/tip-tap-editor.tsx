"use client";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import {
  Button,
  Group,
  Stack,
  Tooltip,
  ActionIcon,
  Popover,
  TextInput,
} from "@mantine/core";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconHighlight,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconQuote,
  IconLink,
  IconLinkOff,
} from "@tabler/icons-react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-700 transition-colors",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 px-1 rounded",
        },
      }),
      Underline,
      TextStyle,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Group wrap="wrap" gap="xs">
        <Tooltip label="Negrito (Ctrl+B)">
          <ActionIcon
            variant={editor.isActive("bold") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            color="blue"
            size="lg"
          >
            <IconBold size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Itálico (Ctrl+I)">
          <ActionIcon
            variant={editor.isActive("italic") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color="blue"
            size="lg"
          >
            <IconItalic size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Sublinhado (Ctrl+U)">
          <ActionIcon
            variant={editor.isActive("underline") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            color="blue"
            size="lg"
          >
            <IconUnderline size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Destacar">
          <ActionIcon
            variant={editor.isActive("highlight") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            color="blue"
            size="lg"
          >
            <IconHighlight size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Título 1">
          <ActionIcon
            variant={
              editor.isActive("heading", { level: 1 }) ? "filled" : "light"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            color="blue"
            size="lg"
          >
            <IconH1 size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Título 2">
          <ActionIcon
            variant={
              editor.isActive("heading", { level: 2 }) ? "filled" : "light"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            color="blue"
            size="lg"
          >
            <IconH2 size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Título 3">
          <ActionIcon
            variant={
              editor.isActive("heading", { level: 3 }) ? "filled" : "light"
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            color="blue"
            size="lg"
          >
            <IconH3 size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Lista com marcadores">
          <ActionIcon
            variant={editor.isActive("bulletList") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color="blue"
            size="lg"
          >
            <IconList size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Lista numerada">
          <ActionIcon
            variant={editor.isActive("orderedList") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color="blue"
            size="lg"
          >
            <IconListNumbers size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Citação">
          <ActionIcon
            variant={editor.isActive("blockquote") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            color="blue"
            size="lg"
          >
            <IconQuote size={18} />
          </ActionIcon>
        </Tooltip>

        <Popover position="bottom" shadow="md">
          <Popover.Target>
            <ActionIcon
              variant={editor.isActive("link") ? "filled" : "light"}
              color="blue"
              size="lg"
            >
              <IconLink size={18} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap="xs">
              <TextInput
                placeholder="https://exemplo.com"
                label="URL do link"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const input = e.currentTarget as HTMLInputElement;
                    if (input.value) {
                      editor
                        .chain()
                        .focus()
                        .setLink({ href: input.value })
                        .run();
                    }
                  }
                }}
              />
              <Button
                size="xs"
                variant="light"
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive("link")}
                leftSection={<IconLinkOff size={14} />}
              >
                Remover Link
              </Button>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>

      <div
        className="editor-content prose prose-sm max-w-none"
        style={{
          padding: "1rem",
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-sm)",
          minHeight: "200px",
          backgroundColor: "white",
        }}
      >
        <EditorContent editor={editor} />
      </div>

      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <Group
          gap="xs"
          className="bg-white border rounded-lg shadow-lg px-2 py-1"
        >
          <ActionIcon
            variant={editor.isActive("bold") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            color="blue"
            size="sm"
          >
            <IconBold size={14} />
          </ActionIcon>
          <ActionIcon
            variant={editor.isActive("italic") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color="blue"
            size="sm"
          >
            <IconItalic size={14} />
          </ActionIcon>
          <ActionIcon
            variant={editor.isActive("highlight") ? "filled" : "light"}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            color="blue"
            size="sm"
          >
            <IconHighlight size={14} />
          </ActionIcon>
        </Group>
      </BubbleMenu>
    </Stack>
  );
}

"use client"

import { useCallback } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  ImageIcon,
  Undo,
  Redo,
  Minus,
  TextInitial,
} from "lucide-react"
import { toast } from "sonner"

type TiptapEditorProps = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Upload failed")
    }

    const data = await res.json()
    return data.url
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Error uploading image")
    return null
  }
}

const ToolbarButton = ({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  label: string
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded hover:bg-accent transition-colors ${
      active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
    }`}
  >
    {children}
  </button>
)

const ToolbarDivider = () => (
  <div className="w-px h-5 bg-border mx-1" />
)

const MenuBar = ({ editor }: { editor: Editor }) => {
  const addImage = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      const url = await uploadImage(file)
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) return

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-input bg-muted/30 rounded-t-lg">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        label="Bold"
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        label="Italic"
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        label="Underline"
      >
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        label="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        label="Heading 1"
      >
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        label="Heading 2"
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        label="Heading 3"
      >
        <Heading3 className="size-4" />
      </ToolbarButton>
      <ToolbarButton 
        onClick={() => editor.chain().focus().setParagraph().run()} 
        active={editor.isActive("paragraph")} 
        label="Paragraph"
      >
        <TextInitial className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        label="Bullet list"
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        label="Ordered list"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        label="Blockquote"
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        label="Code block"
      >
        <Code className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={setLink} active={editor.isActive("link")} label="Link">
        <Link className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} label="Image">
        <ImageIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        label="Horizontal rule"
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        label="Undo"
      >
        <Undo className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        label="Redo"
      >
        <Redo className="size-4" />
      </ToolbarButton>
    </div>
  )
}

const TiptapEditor = ({ content, onChange, placeholder }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      ImageExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-gray dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files
        if (!files?.length) return false

        const imageFile = Array.from(files).find((f) => f.type.startsWith("image/"))
        if (!imageFile) return false

        event.preventDefault()

        uploadImage(imageFile).then((url) => {
          if (url) {
            const { state } = view
            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })
            if (pos) {
              state.tr.insert(
                pos.pos,
                view.state.schema.nodes.image.create({ src: url })
              )
              view.dispatch(state.tr)
            }
          }
        })

        return true
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items
        if (!items?.length) return false

        const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"))
        if (!imageItem) return false

        event.preventDefault()

        const file = imageItem.getAsFile()
        if (!file) return false

        uploadImage(file).then((url) => {
          if (url) {
            const { state } = view
            const pos = view.state.selection.from
            state.tr.insert(
              pos,
              view.state.schema.nodes.image.create({ src: url })
            )
            view.dispatch(state.tr)
          }
        })

        return true
      },
    },
  })

  if (!editor) return null

  return (
    <div className="border border-input rounded-lg bg-background">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor

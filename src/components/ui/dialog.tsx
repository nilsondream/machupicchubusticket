"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { X } from "lucide-react"

type DialogProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export const Dialog = ({ open, onClose, children }: DialogProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-y-auto py-10"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-card rounded-3xl shadow-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-10 size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div className="px-6 pt-6 pb-2 border-b">{children}</div>
)

export const DialogBody = ({ children }: { children: ReactNode }) => (
  <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">{children}</div>
)

export const DialogFooter = ({ children }: { children: ReactNode }) => (
  <div className="px-6 py-4 border-t flex items-center justify-end gap-2">{children}</div>
)

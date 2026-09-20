"use client";

import type { ReactNode } from "react";

import { useCallback, useEffect, useId, useRef } from "react";

import { useRouter } from "next/navigation";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  title: string;

  description?: string;

  children: ReactNode;

  size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export function Modal({
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const router = useRouter();

  const titleId = useId();

  const panelRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Cerrar modal"
        tabIndex={-1}
        onClick={closeModal}
        className="modal-backdrop-enter absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
      />

      {/* Panel */}

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`modal-panel-enter relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl outline-none sm:max-h-[90vh] sm:rounded-2xl ${sizeClasses[size]}`}
      >
        {/* Header */}

        <header className="flex shrink-0 items-start justify-between gap-6 border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-xl font-semibold tracking-tight text-slate-900"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            aria-label="Cerrar"
            onClick={closeModal}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>
        </header>

        {/* Contenido */}

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

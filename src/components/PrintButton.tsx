"use client";

type PrintButtonProps = {
  className?: string;
  children: React.ReactNode;
};

/** Triggers the browser print dialog — Stage-1 stand-in for a generated PDF. */
export function PrintButton({ className, children }: PrintButtonProps) {
  return (
    <button
      type="button"
      className={className}
      data-noprint="1"
      onClick={() => window.print()}
    >
      {children}
    </button>
  );
}

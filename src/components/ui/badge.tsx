import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-900",
  IN_PROGRESS: "bg-sky-100 text-sky-900",
  COMPLETED: "bg-emerald-100 text-emerald-900",
  CANCELLED: "bg-zinc-200 text-zinc-700",
  default: "bg-zinc-100 text-zinc-800",
};

export function Badge({
  status,
  className,
  children,
}: {
  status?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold",
        styles[status || "default"] || styles.default,
        className,
      )}
    >
      {children}
    </span>
  );
}

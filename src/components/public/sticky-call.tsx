import { Phone } from "lucide-react";

export function StickyCallButton({
  phone,
  label,
}: {
  phone: string;
  label: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-[#faf8f3]/95 p-3 backdrop-blur-lg md:hidden">
      <a
        href={`tel:${phone}`}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-base font-bold text-zinc-950"
      >
        <Phone className="h-5 w-5" />
        {label}: {phone}
      </a>
    </div>
  );
}

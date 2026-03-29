'use client';

interface Props {
  className?: string;
}

export default function FeaturedBadge({ className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${className}`}
    >
      ⭐ Featured
    </span>
  );
}

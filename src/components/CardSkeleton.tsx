'use client';

export default function CardSkeleton() {
  return (
    <div className="h-full w-full animate-pulse overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
      {/* Photo placeholder */}
      <div className="h-[68%] w-full bg-sage-100" />

      {/* Content placeholder */}
      <div className="p-5">
        <div className="flex items-baseline gap-2">
          <div className="h-7 w-32 rounded-lg bg-sage-100" />
          <div className="h-5 w-16 rounded-lg bg-sage-50" />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-sage-50" />
          <div className="h-6 w-24 rounded-full bg-sage-50" />
          <div className="h-6 w-16 rounded-full bg-sage-50" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full rounded bg-sage-50" />
          <div className="h-3 w-3/4 rounded bg-sage-50" />
        </div>
        <div className="mt-5 flex justify-center gap-4">
          <div className="h-14 w-14 rounded-full bg-red-50" />
          <div className="h-11 w-11 rounded-full bg-sky-50" />
          <div className="h-14 w-14 rounded-full bg-green-50" />
        </div>
      </div>
    </div>
  );
}

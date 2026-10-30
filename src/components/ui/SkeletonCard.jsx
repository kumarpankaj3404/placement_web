/**
 * SkeletonCard — shimmer loading placeholder.
 * Used for assessment cards, resource cards, and drill cards
 * while data is being fetched from the API (RTK Query isLoading state).
 */
export default function SkeletonCard({ variant = 'default' }) {
  return (
    <div className="bg-[#141622] border border-[#1E2238] rounded-xl p-5 flex flex-col gap-3 animate-pulse">
      {/* Tag row */}
      <div className="flex gap-1.5">
        <div className="h-4 w-14 bg-[#1E2238] rounded-full" />
        <div className="h-4 w-20 bg-[#1E2238] rounded-full" />
      </div>
      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 bg-[#1E2238] rounded w-11/12" />
        <div className="h-4 bg-[#1E2238] rounded w-8/12" />
      </div>
      {/* Meta */}
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-[#1E2238] rounded-lg" />
        <div className="h-5 w-32 bg-[#1E2238] rounded-lg" />
      </div>
      {/* Description lines */}
      {variant === 'resource' && (
        <div className="space-y-1.5">
          <div className="h-3 bg-[#1E2238] rounded w-full" />
          <div className="h-3 bg-[#1E2238] rounded w-10/12" />
        </div>
      )}
      {/* CTA */}
      <div className="mt-auto h-8 bg-[#1E2238] rounded-lg w-full" />
    </div>
  );
}

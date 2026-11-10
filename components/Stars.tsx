// Difficulty as solid stars only: 2 renders two stars, with no empty ones.
export function Stars({ difficulty, className }: { difficulty: number; className?: string }) {
  return (
    <span
      className={className}
      role="img"
      aria-label={`Difficulty ${difficulty} of 5`}
      title={`Difficulty ${difficulty} of 5`}
    >
      {"★".repeat(difficulty)}
    </span>
  );
}

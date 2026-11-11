export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;

// Two overlaid native sliders make one two-thumb range; dragging a thumb past the other pushes it along.
export function DifficultyRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const percent = (value: number) => `${((value - MIN_DIFFICULTY) / (MAX_DIFFICULTY - MIN_DIFFICULTY)) * 100}%`;

  return (
    <>
      <div className="range relative h-5">
        {/* Inset by half a thumb so the track's ends line up with the thumbs' centers. */}
        <div className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border">
          <div
            className="absolute inset-y-0 rounded-full bg-accent"
            style={{ left: percent(min), right: `calc(100% - ${percent(max)})` }}
          />
        </div>
        <input
          type="range"
          min={MIN_DIFFICULTY}
          max={MAX_DIFFICULTY}
          value={min}
          aria-label="Minimum difficulty"
          onChange={(e) => onChange(Number(e.target.value), Math.max(max, Number(e.target.value)))}
        />
        <input
          type="range"
          min={MIN_DIFFICULTY}
          max={MAX_DIFFICULTY}
          value={max}
          aria-label="Maximum difficulty"
          onChange={(e) => onChange(Math.min(min, Number(e.target.value)), Number(e.target.value))}
        />
      </div>
      <div className="mt-1 text-center text-muted tabular-nums">{min === max ? min : `${min} - ${max}`}</div>
    </>
  );
}

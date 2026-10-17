import { MinusIcon, PlusIcon } from "./Icons";

export function QtyStepper({ value, onChange, min = 1, max = 99, small = false }: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; small?: boolean;
}) {
  const size = small ? "h-8 w-8" : "h-11 w-11";
  return (
    <div className="inline-flex items-center rounded-full border border-stone-300 bg-white">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        className={`${size} flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 disabled:opacity-40`} aria-label="Decrease quantity">
        <MinusIcon width={16} height={16} />
      </button>
      <span className={`${small ? "w-7 text-sm" : "w-9"} text-center font-semibold tabular-nums`} aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        className={`${size} flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 disabled:opacity-40`} aria-label="Increase quantity">
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}

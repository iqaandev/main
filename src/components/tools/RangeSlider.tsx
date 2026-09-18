'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';

/**
 * Editorial slider — hairline track, ink fill, square ink thumb.
 * No shadows, no gradients, no rounded blobs: ink on paper.
 * Fully keyboard accessible through Radix (arrows / home / end).
 */
export default function RangeSlider({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  ariaLabel,
  className = '',
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <SliderPrimitive.Root
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(values) => onChange(values[0])}
      className={`relative flex h-6 w-full touch-none select-none items-center ${className}`}
    >
      <SliderPrimitive.Track className="relative h-px grow bg-ink/15">
        <SliderPrimitive.Range className="absolute h-full bg-ink" />
      </SliderPrimitive.Track>
      {/* aria-label lives on the thumb so it is the keyboard-focusable,
          screen-reader-named control (arrows / home / end). */}
      <SliderPrimitive.Thumb
        aria-label={ariaLabel}
        className="block size-3.5 cursor-pointer border border-ink/20 bg-ink transition-colors duration-200 hover:bg-viridian focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/40"
      />
    </SliderPrimitive.Root>
  );
}

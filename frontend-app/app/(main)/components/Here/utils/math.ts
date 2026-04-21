export function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

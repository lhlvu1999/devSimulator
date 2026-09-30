export function nextUnit(seed: number): { rngState: number; value: number } {
  const rngState = (seed + 0x6d2b79f5) >>> 0;
  let t = rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { rngState, value };
}

/** Rounds a fractional gain up or down by chance, so small gains add up to the right amount over time. */
export function roundByChance(
  amount: number,
  seed: number,
): { value: number; rngState: number } {
  const roll = nextUnit(seed);
  const whole = Math.floor(amount);
  return { value: whole + (roll.value < amount - whole ? 1 : 0), rngState: roll.rngState };
}

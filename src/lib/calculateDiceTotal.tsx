type DiceModifier = {
  multiplier: number;
  diceTotal: number;
  enabled: boolean;
};

type DiceCalculationResult = {
  baseTotal: number;
  variableDiceTotal: number;
  finalMultiplier: number;
  beforeFlooring: number;
  finalTotal: number;
  minPossibleRoll: number;
  maxPossibleRoll: number;
};

function smartFloor(num: number) {
  const epsilon = 1e-6; // threshold for "close enough" to the next integer
  const floored = Math.floor(num);
  if (num - floored > 1 - epsilon) {
    return floored + 1; // round up if very close
  }
  return floored; // otherwise just floor
}

export function calculateDiceTotals({
  dice,
  modifiers,
  total,
  source,
}: {
  dice: number[];
  total: number;
  source: "dice" | "total";
  modifiers: DiceModifier[];
}): DiceCalculationResult {
  const DIE_MIN = 1;
  const DIE_MAX = 6;

  /* ---------------- Base Dice ---------------- */
  const diceCount = source == "dice" ? dice.length : 3;
  const baseTotal = source == "dice" ? dice.reduce((a, b) => a + b, 0) : total;

  const minBase = diceCount * DIE_MIN;
  const maxBase = diceCount * DIE_MAX;

  /* ---------------- Modifiers ---------------- */
  const variableDiceTotal = modifiers.reduce(
    (total, m) => (m.enabled ? total + m.diceTotal : total),
    0,
  );

  const multiplierSum = modifiers.reduce(
    (acc, m) => (m.enabled ? acc + m.multiplier : acc),
    0,
  );

  const finalMultiplier = multiplierSum === 0 ? 1 : multiplierSum;

  /* ---------------- Final Totals ---------------- */
  const beforeFlooring = (baseTotal + variableDiceTotal) * finalMultiplier;

  const finalTotal = smartFloor(beforeFlooring);

  /* ---------------- Min / Max Possible Roll ---------------- */
  const minVariable = modifiers.reduce(
    (acc, m) => (m.enabled ? acc + Math.min(0, m.diceTotal) : acc),
    0,
  );

  const maxVariable = modifiers.reduce(
    (acc, m) => (m.enabled ? acc + Math.max(0, m.diceTotal) : acc),
    0,
  );

  const minPossibleRoll = smartFloor((minBase + minVariable) * finalMultiplier);

  const maxPossibleRoll = smartFloor((maxBase + maxVariable) * finalMultiplier);

  return {
    baseTotal,
    variableDiceTotal,
    finalMultiplier,
    beforeFlooring,
    finalTotal,
    minPossibleRoll,
    maxPossibleRoll,
  };
}

import { DiceModifier } from "./DiceModifier";

type Modifier = {
  multiplier: number;
  diceTotal: number;
  enabled: boolean;
};

type DiceModifiersPanelProps = {
  modifiers: Modifier[];
  setModifiers: (modifiers: Modifier[]) => void;
};

export function DiceModifiersPanel({
  modifiers,
  setModifiers,
}: DiceModifiersPanelProps) {
  const addModifier = () => {
    setModifiers([
      ...modifiers,
      { multiplier: 0, diceTotal: 0, enabled: true },
    ]);
  };

  const updateModifier = (index: number, value: Modifier) => {
    setModifiers(modifiers.map((m, i) => (i === index ? value : m)));
  };

  const removeModifier = (index: number) => {
    setModifiers(modifiers.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      {modifiers.map((modifier, i) => (
        <DiceModifier
          key={i}
          value={modifier}
          onChange={(v) => updateModifier(i, v)}
          onRemove={() => removeModifier(i)}
        />
      ))}

      <button
        onClick={addModifier}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add modifier
      </button>
    </div>
  );
}

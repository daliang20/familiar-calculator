import { useState } from 'react'
import './App.css'
import { DiceSelector } from './Dice'
import { DiceModifiersPanel } from './DiceModifierPanel'

function smartFloor(num: number) {
  const epsilon = 1e-6; // threshold for "close enough" to the next integer
  const floored = Math.floor(num);
  if (num - floored > 1 - epsilon) {
    return floored + 1; // round up if very close
  }
  return floored; // otherwise just floor
}

function App() {
  const [dice, setDice] = useState<number[]>([0, 0, 0])
  const [modifiers, setModifiers] = useState<
    { multiplier: number; diceTotal: number }[]
  >([])

  const setDie = (index: number, value: number) => {
    setDice((prev) =>
      prev.map((d, i) => (i === index ? value : d))
    )
  }

  const labels = ['Die 1', 'Die 2', 'Die 3']

  // Calculate totals
  const diceRollTotal = dice.reduce((a, b) => a + b, 0)
  const variableDiceTotal = modifiers.reduce(
    (total, m) => total + m.diceTotal,
    0
  )

  // Final multiplier = sum of all multipliers
  const finalMultiplier = modifiers.reduce(
    (acc, m) => acc + m.multiplier,
    0
  )

  // Floor final value
  const diceTotalBeforeFlooring = (diceRollTotal + variableDiceTotal) * finalMultiplier;
  const diceTotal = smartFloor(diceTotalBeforeFlooring);

  return (
    <div className="flex gap-6 p-6">
      {/* Left panel: dice + modifiers */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Dice selectors */}
        <div className="flex gap-4">
          {dice.map((value, i) => (
            <DiceSelector
              key={i}
              label={labels[i]}
              value={value}
              onChange={(v) => setDie(i, v)}
            />
          ))}
        </div>

        {/* Modifiers panel */}
        <div>
          <DiceModifiersPanel
            modifiers={modifiers}
            setModifiers={setModifiers}
          />
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-px bg-gray-300" />

      {/* Totals panel */}
      <div className="flex flex-col gap-4 p-4 border rounded-lg min-w-[180px]">
        <h3 className="text-lg font-medium">Totals</h3>
        <div>
          <span className="font-medium">Base Dice Total:</span> {diceRollTotal}
        </div>

        <div>
          <span className="font-medium">Variable Dice Total:</span> {variableDiceTotal}
        </div>

        <div>
          <span className="font-medium">Final Multiplier:</span> {finalMultiplier.toFixed(2)}
        </div>

        <div>
          <span className="font-medium">Before Flooring</span> {diceTotalBeforeFlooring}
        </div>

        <div>
          <span className="font-medium">Final Value:</span> {diceTotal}
        </div>
      </div>
    </div>
  )
}

export default App

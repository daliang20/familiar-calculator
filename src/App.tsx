import { useState, useEffect } from 'react'
import './App.css'
import { DiceSelector } from './Dice'
import { DiceModifiersPanel } from './DiceModifierPanel'
import { Separator } from "@/components/ui/separator"
import { NumberInput } from './NumericInput'

function smartFloor(num: number) {
  const epsilon = 1e-6; // threshold for "close enough" to the next integer
  const floored = Math.floor(num);
  if (num - floored > 1 - epsilon) {
    return floored + 1; // round up if very close
  }
  return floored; // otherwise just floor
}

function distributeTotal(total: number, count: number): number[] {
  const base = Math.floor(total / count)
  let remainder = total % count

  return Array.from({ length: count }, () => {
    if (remainder > 0) {
      remainder--
      return base + 1
    }
    return base
  })
}

type DiceState = {
  dice: number[]   // e.g. [2, 5, 3]
  total: number
  source: "dice" | "total"
}

function App() {
  const [state, setState] = useState<DiceState>({
    dice: [1, 1, 1],
    total: 3,
    source: "dice",
  })

  // When dice change, recompute total
  useEffect(() => {
    if (state.source === "dice") {
      const sum = state.dice.reduce((a, b) => a + b, 0)
      if (sum !== state.total) {
        setState(s => ({ ...s, total: sum }))
      }
    }
  }, [state.dice, state.source])

  // When total changes, reconcile into dice
  useEffect(() => {
    if (state.source === "total") {
      setState(s => ({
        ...s,
        dice: distributeTotal(s.total, s.dice.length),
      }))
    }
  }, [state.total, state.source])

  const [modifiers, setModifiers] = useState<
    { multiplier: number; diceTotal: number, enabled: boolean }[]
  >([])


  const labels = ['Dice 1', 'Dice 2', 'Dice 3']

  // Calculate totals
  const variableDiceTotal = modifiers.reduce(
    (total, m) => m.enabled ? total + m.diceTotal : total,
    0
  )

  // Final multiplier = sum of all multipliers
  const multiplier = modifiers.reduce(
    (acc, m) => m.enabled ? acc + m.multiplier : acc,
    0
  )

  const finalMultiplier = multiplier == 0 ? 1 : multiplier;

  // Floor final value
  const diceTotalBeforeFlooring = (state.total + variableDiceTotal) * finalMultiplier;
  const diceTotal = smartFloor(diceTotalBeforeFlooring);

  return (
    <div className="flex gap-6 p-6">
      {/* Left panel: dice + modifiers */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Dice selectors */}
        <div className="flex gap-4">
          {state.dice.map((value, i) => (
            <DiceSelector
              key={i}
              number={1}
              label={labels[0]}
              value={value}
              onChange={newValue => {
                const dice = [...state.dice]
                if (newValue) {
                  dice[i] = Number(newValue)
                  setState({
                    dice,
                    total: state.total,
                    source: "dice",
                  })
                }
              }}
            />
          ))}


          <Separator orientation='vertical' />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {"Total"}
            </div>
            <NumberInput
              placeholder={"Total"}
              defaultValue={1}
              value={state.total}
              onValueChange={(newValue) => {
                if (newValue) {
                  setState({
                    dice: state.dice,
                    total: Number(newValue),
                    source: "total",
                  })
                }
              }}
              displayButtons={false}
            />
          </div>

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
          <span className="font-medium">Base Dice Total:</span> {state.total}
        </div>

        <div>
          <span className="font-medium">Variable Dice Total:</span> {variableDiceTotal}
        </div>

        <div>
          <span className="font-medium">Final Multiplier:</span> {finalMultiplier.toFixed(2)}
        </div>

        <div>
          <span className="font-medium">Before Flooring</span> {diceTotalBeforeFlooring.toFixed(4)}
        </div>

        <div>
          <span className="font-medium">Final Value:</span> {diceTotal}
        </div>
      </div>
    </div>
  )
}

export default App

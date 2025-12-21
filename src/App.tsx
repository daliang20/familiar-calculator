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

function App() {
  const [dice, setDice] = useState<number[]>([1, 1, 1])
  const [dice1, setDice1] = useState<number>(1);
  const [dice2, setDice2] = useState<number>(1);
  const [dice3, setDice3] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [manualTotalInput, setManualTotalInput] = useState(false);


  useEffect(() => {
    const diceRollTotal = [dice1, dice2, dice3].reduce((a, b) => a + b, 0);
    setTotal(diceRollTotal);
  }, [dice1, dice2, dice3]);

  useEffect(() => {
    if (manualTotalInput) {
      setDice1(1);
      setDice2(1);
      setDice3(1);
    }
  }, [total]);



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
  const diceTotalBeforeFlooring = (total + variableDiceTotal) * finalMultiplier;
  const diceTotal = smartFloor(diceTotalBeforeFlooring);

  return (
    <div className="flex gap-6 p-6">
      {/* Left panel: dice + modifiers */}
      <div className="flex flex-col gap-6 flex-1">
        {/* Dice selectors */}
        <div className="flex gap-4">
          <DiceSelector
            number={1}
            label={labels[0]}
            value={dice1}
            onChange={(v) => {
              setDice1(v);
              setManualTotalInput(false);
            }}
          />
          <DiceSelector
            number={2}
            label={labels[1]}
            value={dice2}
            onChange={(v) => {
              setDice2(v);
              setManualTotalInput(false);
            }}
          />

          <DiceSelector
            number={3}
            label={labels[2]}
            value={dice2}
            onChange={(v) => {
              setDice3(v);
              setManualTotalInput(false);
            }}
          />

          <Separator orientation='vertical' />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {"Total"}
            </div>
            <NumberInput placeholder={"Total"} defaultValue={1} value={total} onValueChange={(v) => { setTotal(v); setManualTotalInput(true); }} displayButtons={false} />
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
          <span className="font-medium">Base Dice Total:</span> {total}
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

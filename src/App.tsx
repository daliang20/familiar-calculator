import { useState, useEffect } from "react";
import "./App.css";
import { DiceSelector } from "./Dice";
// import { DiceModifiersPanel } from './DiceModifierPanel'
import { Separator } from "@/components/ui/separator";
import { NumberInput } from "./NumericInput";
import { DiceModifiersTable } from "./DiceModifierTable";
import Suinose from "./assets/suinose.ico";
import Suinose67 from "./assets/suinose-67.gif";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";

function smartFloor(num: number) {
  const epsilon = 1e-6; // threshold for "close enough" to the next integer
  const floored = Math.floor(num);
  if (num - floored > 1 - epsilon) {
    return floored + 1; // round up if very close
  }
  return floored; // otherwise just floor
}

// function distributeTotal(total: number, count: number): number[] {
//   const base = Math.floor(total / count);
//   let remainder = total % count;

//   return Array.from({ length: count }, () => {
//     if (remainder > 0) {
//       remainder--;
//       return base + 1;
//     }
//     return base;
//   });
// }

type DiceState = {
  dice: number[]; // e.g. [2, 5, 3]
  total: number;
  source: "dice" | "total";
};

function App() {
  const [animateSuisei, setAnimateSuisei] = useState(false);
  const [state, setState] = useState<DiceState>({
    dice: [1, 1, 1],
    total: 3,
    source: "dice",
  });

  // When dice change, recompute total
  useEffect(() => {
    if (state.source === "dice") {
      const sum = state.dice.reduce((a, b) => a + b, 0);
      if (sum !== state.total) {
        setState((s) => ({ ...s, total: sum }));
      }
    } else if (state.source === "total") {
      // setState(s => ({
      //   ...s,
      //   dice: distributeTotal(s.total, s.dice.length),
      // }))
    }
  }, [state.dice, state.total, state.source]);

  const [modifiers, setModifiers] = useState<
    { multiplier: number; diceTotal: number; enabled: boolean }[]
  >([]);

  const labels = ["Dice 1", "Dice 2", "Dice 3"];

  // Calculate totals
  const variableDiceTotal = modifiers.reduce(
    (total, m) => (m.enabled ? total + m.diceTotal : total),
    0
  );

  // Final multiplier = sum of all multipliers
  const multiplier = modifiers.reduce(
    (acc, m) => (m.enabled ? acc + m.multiplier : acc),
    0
  );

  const finalMultiplier = multiplier == 0 ? 1 : multiplier;

  // Floor final value
  const diceTotalBeforeFlooring =
    (state.total + variableDiceTotal) * finalMultiplier;
  const diceTotal = smartFloor(diceTotalBeforeFlooring);

  // When dice change, recompute total
  useEffect(() => {
    if (diceTotal === 67) {
      setAnimateSuisei(true);
    } else {
      setAnimateSuisei(false);
    }
  }, [diceTotal]);

  const totalsData = [
    { key: "Base Dice Total", value: state.total },
    { key: "Variable Dice Total", value: variableDiceTotal },
    { key: "Final Multiplier", value: finalMultiplier.toFixed(2) },
    { key: "Before Flooring", value: diceTotalBeforeFlooring.toFixed(2) },
    // { key: "Final Value", value: diceTotal },
  ];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex gap-6 p-6">
        {/* Left panel: dice + modifiers */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Dice selectors */}
          <div className="flex gap-4">
            {state.dice.map((value, i) => (
              <DiceSelector
                key={i}
                number={i + 1}
                label={labels[i]}
                value={value}
                onChange={(newValue) => {
                  const dice = [...state.dice];
                  if (newValue) {
                    dice[i] = Number(newValue);
                    setState({
                      dice,
                      total: state.total,
                      source: "dice",
                    });
                  }
                }}
              />
            ))}

            <Separator orientation="vertical" />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">{"Total"}</div>
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
                    });
                  }
                }}
                displayButtons={false}
              />
            </div>
          </div>

          <DiceModifiersTable
            modifiers={modifiers}
            setModifiers={setModifiers}
          />
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-gray-300" />

        {/* Totals panel */}
        <div className="p-4 border rounded-lg min-w-[200px]">
          <h3 className="text-lg font-medium mb-2">Totals</h3>

          <Table>
            <TableBody>
              {totalsData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-left font-medium">
                    {item.key}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableCell className="text-left font-medium">
                Final Value
              </TableCell>
              <TableCell className="text-right font-semibold">
                {diceTotal}
              </TableCell>
            </TableFooter>
          </Table>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <ButtonGroup>
          <ModeToggle />
          <Button
            variant="outline"
            size="icon"
            onMouseEnter={() => setAnimateSuisei(true)}
            onMouseLeave={() => setAnimateSuisei(false)}
          >
            <a
              href="https://www.youtube.com/@HoshimachiSuisei/join"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Reference the file directly from the public path */}
              <img src={animateSuisei ? Suinose67 : Suinose} alt="My Icon" />
            </a>
          </Button>
        </ButtonGroup>
      </div>
    </ThemeProvider>
  );
}

export default App;

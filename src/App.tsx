import { useState, useEffect } from "react";
import "./App.css";
import { DiceSelector } from "./Dice";
// import { DiceModifiersPanel } from './DiceModifierPanel'
import { Separator } from "@/components/ui/separator";
import { DiceModifiersTable } from "./DiceModifierTable";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { ButtonGroup } from "./components/ui/button-group";
import { Input } from "./components/ui/input";
import { SuiseiIcon } from "./SuiseiIcon";
import { calculateDiceTotals } from "./lib/calculateDiceTotal";

type DiceState = {
  dice: number[]; // e.g. [2, 5, 3]
  total: number;
  source: "dice" | "total";
};

function App() {
  const [stringTotal, setStringTotal] = useState("");
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
    }
  }, [state.dice, state.total, state.source]);

  const [modifiers, setModifiers] = useState<
    { multiplier: number; diceTotal: number; enabled: boolean }[]
  >([]);

  const labels = ["Dice 1", "Dice 2", "Dice 3"];

  const { variableDiceTotal, finalMultiplier, beforeFlooring, finalTotal } =
    calculateDiceTotals({
      dice: state.dice,
      modifiers,
      total: state.total,
      source: state.source,
    });

  const totalsData = [
    { key: "Base Dice Total", value: state.total },
    { key: "Variable Dice Total", value: variableDiceTotal },
    { key: "Final Multiplier", value: finalMultiplier.toFixed(2) },
    { key: "Before Flooring", value: beforeFlooring.toFixed(2) },
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
              <Input
                type="number"
                placeholder={"Total"}
                value={state.source === "total" ? stringTotal : state.total}
                onValueChange={(newValue) => {
                  setStringTotal(newValue.raw);
                  setState({
                    dice: state.dice,
                    total: Number(newValue.value),
                    source: "total",
                  });
                }}
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
                {finalTotal}
              </TableCell>
            </TableFooter>
          </Table>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <ButtonGroup>
          <ModeToggle />
          <SuiseiIcon animate={finalTotal === 67} />
        </ButtonGroup>
      </div>
    </ThemeProvider>
  );
}

export default App;

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect, useRef, useState } from "react";
import { ButtonGroup } from "./components/ui/button-group";

type Modifier = {
  multiplier: number;
  diceTotal: number;
  enabled: boolean;
};

type DiceModifiersTableProps = {
  modifiers: Modifier[];
  setModifiers: (modifiers: Modifier[]) => void;
};

export function DiceModifiersTable({
  modifiers,
  setModifiers,
}: DiceModifiersTableProps) {
  const [diceInputs, setDiceInputs] = useState<string[]>(
    modifiers.map((m) => String(m.diceTotal))
  );
  const [multiplierInputs, setMultiplierInputs] = useState<string[]>(
    modifiers.map((m) => String(m.multiplier))
  );

  const diceDebounceRefs = useRef<Record<number, number>>({});
  const multDebounceRefs = useRef<Record<number, number>>({});

  useEffect(() => {
    setDiceInputs(modifiers.map((m) => String(m.diceTotal)));
    setMultiplierInputs(modifiers.map((m) => String(m.multiplier)));
  }, [modifiers]);

  const updateModifier = (index: number, value: Partial<Modifier>) => {
    setModifiers(
      modifiers.map((m, i) => (i === index ? { ...m, ...value } : m))
    );
  };

  const clearDiceDebounce = (index: number) => {
    clearTimeout(diceDebounceRefs.current[index]);
    delete diceDebounceRefs.current[index];
  };

  const clearMultDebounce = (index: number) => {
    clearTimeout(multDebounceRefs.current[index]);
    delete multDebounceRefs.current[index];
  };

  /* ---------------- Dice Total ---------------- */

  const commitDice = (index: number, value: number) => {
    clearDiceDebounce(index);
    updateModifier(index, { diceTotal: value });
    setDiceInputs((p) => p.map((x, i) => (i === index ? String(value) : x)));
  };

  const scheduleDiceCommit = (index: number, value: string) => {
    clearDiceDebounce(index);

    diceDebounceRefs.current[index] = window.setTimeout(() => {
      if (value === "" || value === "-") return;
      const num = Number(value);
      if (!isNaN(num)) {
        updateModifier(index, { diceTotal: num });
      }
    }, 250);
  };

  /* ---------------- Multiplier ---------------- */

  const commitMultiplier = (index: number, value: number) => {
    clearMultDebounce(index);
    updateModifier(index, { multiplier: value });
    setMultiplierInputs((p) =>
      p.map((x, i) => (i === index ? String(value) : x))
    );
  };

  const scheduleMultiplierCommit = (index: number, value: string) => {
    clearMultDebounce(index);

    multDebounceRefs.current[index] = window.setTimeout(() => {
      if (value === "") return;
      const num = Number(value);
      if (!isNaN(num) && num >= 0) {
        updateModifier(index, { multiplier: num });
      }
    }, 250);
  };

  /* ---------------- Table Actions ---------------- */

  const addModifier = () => {
    setModifiers([
      ...modifiers,
      { multiplier: 0, diceTotal: 0, enabled: true },
    ]);
    setDiceInputs((p) => [...p, "0"]);
    setMultiplierInputs((p) => [...p, "0"]);
  };

  const removeModifier = (index: number) => {
    setModifiers(modifiers.filter((_, i) => i !== index));
    setDiceInputs((p) => p.filter((_, i) => i !== index));
    setMultiplierInputs((p) => p.filter((_, i) => i !== index));
    clearDiceDebounce(index);
    clearMultDebounce(index);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] text-center">Enabled</TableHead>
              <TableHead>Dice Total</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {modifiers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No modifiers added.
                </TableCell>
              </TableRow>
            ) : (
              modifiers.map((modifier, index) => (
                <TableRow key={index}>
                  {/* Enabled */}
                  <TableCell className="text-center">
                    <Checkbox
                      checked={modifier.enabled}
                      onCheckedChange={(checked) =>
                        updateModifier(index, { enabled: checked === true })
                      }
                    />
                  </TableCell>

                  {/* Dice Total */}
                  <TableCell>
                    <InputGroup>
                      <InputGroupAddon asChild align="inline-end">
                        <InputGroupButton
                          variant={"outline"}
                          className="rounded-full"
                          size="icon-xs"
                          disabled={!modifier.enabled}
                          onClick={() =>
                            commitDice(index, modifier.diceTotal + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </InputGroupButton>
                        <InputGroupButton
                          variant={"outline"}
                          className="rounded-full"
                          size="icon-xs"
                          disabled={!modifier.enabled}
                          onClick={() =>
                            commitDice(index, modifier.diceTotal - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </InputGroupButton>
                      </InputGroupAddon>

                      <InputGroupInput
                        type="text"
                        inputMode="numeric"
                        disabled={!modifier.enabled}
                        value={diceInputs[index]}
                        onChange={(e) => {
                          const v = e.target.value;

                          if (v === "" || v === "-") {
                            setDiceInputs((p) =>
                              p.map((x, i) => (i === index ? v : x))
                            );
                            return;
                          }

                          if (/^-?\d+$/.test(v)) {
                            setDiceInputs((p) =>
                              p.map((x, i) => (i === index ? v : x))
                            );
                            scheduleDiceCommit(index, v);
                          }
                        }}
                      />
                    </InputGroup>
                  </TableCell>

                  {/* Multiplier */}
                  <TableCell>
                    <InputGroup>
                      <InputGroupAddon asChild align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          variant="outline"
                          className="rounded-full"
                          disabled={!modifier.enabled}
                          onClick={() =>
                            commitMultiplier(
                              index,
                              +(modifier.multiplier + 0.2).toFixed(3)
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </InputGroupButton>
                        <InputGroupButton
                          size="icon-xs"
                          variant="outline"
                          className="rounded-full"
                          disabled={!modifier.enabled}
                          onClick={() =>
                            commitMultiplier(
                              index,
                              Math.max(
                                0,
                                +(modifier.multiplier - 0.2).toFixed(3)
                              )
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </InputGroupButton>
                      </InputGroupAddon>

                      <InputGroupInput
                        type="text"
                        inputMode="decimal"
                        disabled={!modifier.enabled}
                        value={multiplierInputs[index]}
                        onChange={(e) => {
                          const v = e.target.value;

                          if (v === "") {
                            setMultiplierInputs((p) =>
                              p.map((x, i) => (i === index ? v : x))
                            );
                            return;
                          }

                          if (/^\d*\.?\d*$/.test(v)) {
                            setMultiplierInputs((p) =>
                              p.map((x, i) => (i === index ? v : x))
                            );
                            scheduleMultiplierCommit(index, v);
                          }
                        }}
                      />
                    </InputGroup>
                  </TableCell>

                  {/* Remove */}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeModifier(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Button
        onClick={addModifier}
        variant="outline"
        className="self-start gap-2 border-dashed"
      >
        <Plus className="h-4 w-4" />
        Add Modifier
      </Button>
    </div>
  );
}

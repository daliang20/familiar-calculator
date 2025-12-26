import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, Diff, X, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect, useRef, useState } from "react";

type Modifier = {
  id: string;
  multiplier: number;
  diceTotal: number;
  enabled: boolean;
  favorite?: boolean;
};

type DiceModifiersTableProps = {
  modifiers: Modifier[];
  setModifiers: (updater: (prev: Modifier[]) => Modifier[]) => void;
};

export function DiceModifiersTable({
  modifiers,
  setModifiers,
}: DiceModifiersTableProps) {
  const [diceInputs, setDiceInputs] = useState<Record<string, string>>({});
  const [multiplierInputs, setMultiplierInputs] = useState<
    Record<string, string>
  >({});

  const diceDebounceRefs = useRef<Record<string, number>>({});
  const multDebounceRefs = useRef<Record<string, number>>({});
  const editingRef = useRef<Record<string, boolean>>({});

  /* ---------------- Sync inputs when modifiers change ---------------- */

  useEffect(() => {
    setDiceInputs((prev) => {
      const next = { ...prev };
      modifiers.forEach((m) => {
        if (!editingRef.current[m.id]) {
          next[m.id] = String(m.diceTotal);
        }
      });
      return next;
    });

    setMultiplierInputs((prev) => {
      const next = { ...prev };
      modifiers.forEach((m) => {
        if (!editingRef.current[m.id]) {
          next[m.id] = String(m.multiplier);
        }
      });
      return next;
    });
  }, [modifiers]);

  /* ---------------- Helpers ---------------- */

  const updateModifier = (id: string, value: Partial<Modifier>) => {
    setModifiers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...value } : m)),
    );
  };

  const clearDiceDebounce = (id: string) => {
    clearTimeout(diceDebounceRefs.current[id]);
    delete diceDebounceRefs.current[id];
  };

  const clearMultDebounce = (id: string) => {
    clearTimeout(multDebounceRefs.current[id]);
    delete multDebounceRefs.current[id];
  };

  /* ---------------- Dice Total ---------------- */

  const commitDice = (id: string, value: number) => {
    clearDiceDebounce(id);
    editingRef.current[id] = false;
    updateModifier(id, { diceTotal: value });
    setDiceInputs((p) => ({ ...p, [id]: String(value) }));
  };

  const scheduleDiceCommit = (id: string, value: string) => {
    clearDiceDebounce(id);

    diceDebounceRefs.current[id] = window.setTimeout(() => {
      if (value === "" || value === "-") return;
      const num = Number(value);
      if (!isNaN(num)) {
        updateModifier(id, { diceTotal: num });
      }
    }, 250);
  };

  /* ---------------- Multiplier ---------------- */

  const commitMultiplier = (id: string, value: number) => {
    clearMultDebounce(id);
    editingRef.current[id] = false;
    updateModifier(id, { multiplier: value });
    setMultiplierInputs((p) => ({ ...p, [id]: String(value) }));
  };

  const scheduleMultiplierCommit = (id: string, value: string) => {
    clearMultDebounce(id);

    multDebounceRefs.current[id] = window.setTimeout(() => {
      if (value === "") return;
      const num = Number(value);
      if (!isNaN(num) && num >= 0) {
        updateModifier(id, { multiplier: num });
      }
    }, 250);
  };

  /* ---------------- Table Actions ---------------- */

  const addModifier = () => {
    const id = crypto.randomUUID();

    setModifiers((prev) => [
      ...prev,
      { id, multiplier: 0, diceTotal: 0, enabled: true },
    ]);

    setDiceInputs((p) => ({ ...p, [id]: "0" }));
    setMultiplierInputs((p) => ({ ...p, [id]: "0" }));
  };

  const removeModifier = (id: string) => {
    setModifiers((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target?.favorite) return prev;
      return prev.filter((m) => m.id !== id);
    });

    setDiceInputs((p) => {
      const { [id]: _, ...rest } = p;
      return rest;
    });

    setMultiplierInputs((p) => {
      const { [id]: _, ...rest } = p;
      return rest;
    });

    delete editingRef.current[id];
    clearDiceDebounce(id);
    clearMultDebounce(id);
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] text-center">Enabled</TableHead>
              <TableHead>Dice Total</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead className="w-[90px]" />
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
              modifiers.map((modifier) => (
                <TableRow key={modifier.id}>
                  {/* Enabled */}
                  <TableCell className="text-center">
                    <Checkbox
                      checked={modifier.enabled}
                      onCheckedChange={(checked) =>
                        updateModifier(modifier.id, {
                          enabled: checked === true,
                        })
                      }
                    />
                  </TableCell>

                  {/* Dice Total */}
                  <TableCell>
                    <InputGroup>
                      <InputGroupAddon>
                        <Diff />
                      </InputGroupAddon>

                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          variant="outline"
                          className="rounded-full"
                          size="icon-xs"
                          disabled={!modifier.enabled}
                          onClick={() =>
                            commitDice(modifier.id, modifier.diceTotal + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </InputGroupButton>
                        <InputGroupButton
                          variant="outline"
                          className="rounded-full"
                          size="icon-xs"
                          disabled={!modifier.enabled}
                          onClick={() =>
                            commitDice(modifier.id, modifier.diceTotal - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </InputGroupButton>
                      </InputGroupAddon>

                      <InputGroupInput
                        type="text"
                        inputMode="numeric"
                        disabled={!modifier.enabled}
                        value={diceInputs[modifier.id] ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          editingRef.current[modifier.id] = true;

                          if (v === "" || v === "-") {
                            setDiceInputs((p) => ({
                              ...p,
                              [modifier.id]: v,
                            }));
                            return;
                          }

                          if (/^-?\d+$/.test(v)) {
                            setDiceInputs((p) => ({
                              ...p,
                              [modifier.id]: v,
                            }));
                            scheduleDiceCommit(modifier.id, v);
                          }
                        }}
                      />
                    </InputGroup>
                  </TableCell>

                  {/* Multiplier */}
                  <TableCell>
                    <InputGroup>
                      <InputGroupAddon>
                        <X />
                      </InputGroupAddon>

                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          variant="outline"
                          className="rounded-full"
                          disabled={!modifier.enabled}
                          onClick={() =>
                            commitMultiplier(
                              modifier.id,
                              +(modifier.multiplier + 0.2).toFixed(3),
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
                              modifier.id,
                              Math.max(
                                0,
                                +(modifier.multiplier - 0.2).toFixed(3),
                              ),
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
                        value={multiplierInputs[modifier.id] ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          editingRef.current[modifier.id] = true;

                          if (v === "" || v.endsWith(".")) {
                            setMultiplierInputs((p) => ({
                              ...p,
                              [modifier.id]: v,
                            }));
                            return;
                          }

                          if (/^\d*\.?\d*$/.test(v)) {
                            setMultiplierInputs((p) => ({
                              ...p,
                              [modifier.id]: v,
                            }));
                            scheduleMultiplierCommit(modifier.id, v);
                          }
                        }}
                      />
                    </InputGroup>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateModifier(modifier.id, {
                          favorite: !modifier.favorite,
                        })
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${
                          modifier.favorite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={modifier.favorite}
                      onClick={() => removeModifier(modifier.id)}
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

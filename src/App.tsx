import { useState, useEffect } from "react";
import "./App.css";
import { DiceSelector } from "./Dice";
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

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Pencil, Trash2 } from "lucide-react";

const STORAGE_KEY = "dice-profiles:v1";

type StoredState = {
  profiles: Profile[];
  activeProfileId: string | null;
};

type DiceState = {
  dice: number[];
  total: number;
  source: "dice" | "total";
};

export type DiceModifier = {
  id: string;
  multiplier: number;
  diceTotal: number;
  enabled: boolean;
  favorite?: boolean;
};

export type Profile = {
  id: string;
  name: string;
  modifiers: DiceModifier[];
};

function App() {
  const [stringTotal, setStringTotal] = useState("");
  const [targetToBeat, setTargetToBeat] = useState("");
  const [state, setState] = useState<DiceState>({
    dice: [1, 1, 1],
    total: 3,
    source: "dice",
  });

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileNameDraft, setProfileNameDraft] = useState("");
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const modifiers = activeProfile?.modifiers ?? [];

  const labels = ["Dice 1", "Dice 2", "Dice 3"];

  // Helper to save profiles and activeProfileId
  function saveProfiles(
    updatedProfiles: Profile[],
    newActiveId: string | null,
  ) {
    setProfiles(updatedProfiles);
    setActiveProfileId(newActiveId);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profiles: updatedProfiles,
        activeProfileId: newActiveId,
      }),
    );
  }

  // Load profiles from localStorage or create default
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: StoredState = JSON.parse(raw);
        const loadedProfiles = parsed.profiles.map((p) => ({
          ...p,
          modifiers: p.modifiers.map((m) => ({
            id: m.id ?? crypto.randomUUID(),
            multiplier: m.multiplier ?? 0,
            diceTotal: m.diceTotal ?? 0,
            enabled: m.enabled ?? true,
            favorite: m.favorite ?? false,
          })),
        }));
        setProfiles(loadedProfiles);
        setActiveProfileId(
          parsed.activeProfileId ?? loadedProfiles[0]?.id ?? null,
        );
        return;
      } catch {
        console.warn("Failed to parse stored profiles");
      }
    }

    // No profiles in storage, create default
    const id = crypto.randomUUID();
    const defaultProfile = { id, name: "Default", modifiers: [] };
    saveProfiles([defaultProfile], id);
  }, []);

  // Update total when dice change
  useEffect(() => {
    if (state.source === "dice") {
      const sum = state.dice.reduce((a, b) => a + b, 0);
      if (sum !== state.total) {
        setState((s) => ({ ...s, total: sum }));
      }
    }
  }, [state.dice, state.source, state.total]);

  // Profile CRUD
  function openCreateProfileDialog() {
    setEditingProfileId(null);
    setProfileNameDraft("");
    setProfileDialogOpen(true);
  }

  function openRenameProfileDialog(profile: Profile) {
    setEditingProfileId(profile.id);
    setProfileNameDraft(profile.name);
    setProfileDialogOpen(true);
  }

  function submitProfileDialog() {
    const name = profileNameDraft.trim();
    if (!name) return;

    if (editingProfileId) {
      // Rename
      const updated = profiles.map((p) =>
        p.id === editingProfileId ? { ...p, name } : p,
      );
      saveProfiles(updated, activeProfileId);
    } else {
      // Create
      const id = crypto.randomUUID();
      const newProfile = { id, name, modifiers: [] };
      saveProfiles([...profiles, newProfile], id);
    }

    setProfileDialogOpen(false);
    setProfileNameDraft("");
    setEditingProfileId(null);
  }

  function deleteProfile(id: string) {
    const updated = profiles.filter((p) => p.id !== id);
    const newActive =
      activeProfileId === id ? updated[0]?.id ?? null : activeProfileId;
    saveProfiles(updated, newActive);
  }

  function updateActiveProfileModifiers(
    updater: (mods: DiceModifier[]) => DiceModifier[],
  ) {
    if (!activeProfileId) return;
    const updatedProfiles = profiles.map((p) =>
      p.id === activeProfileId ? { ...p, modifiers: updater(p.modifiers) } : p,
    );
    saveProfiles(updatedProfiles, activeProfileId);
  }

  const {
    variableDiceTotal,
    finalMultiplier,
    beforeFlooring,
    finalTotal,
    maxPossibleRoll,
    minPossibleRoll,
  } = calculateDiceTotals({
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
    { key: "Minimum Roll (3) ", value: minPossibleRoll },
    { key: "Maximum Roll (18)", value: maxPossibleRoll },
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
                  if (newValue) {
                    const dice = [...state.dice];
                    dice[i] = Number(newValue);
                    setState({ dice, total: state.total, source: "dice" });
                  }
                }}
              />
            ))}

            <Separator orientation="vertical" />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">Total/Target</div>
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
              <Input
                type="number"
                placeholder={"Target"}
                value={targetToBeat}
                onValueChange={(newValue) => setTargetToBeat(newValue.raw)}
              />
            </div>
          </div>

          {/* Profile Selector */}
          <div className="flex items-center gap-2">
            <Select
              value={activeProfileId ?? ""}
              onValueChange={setActiveProfileId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={openCreateProfileDialog}
              title="Create profile"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {activeProfile && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openRenameProfileDialog(activeProfile)}
                  title="Rename profile"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                {profiles.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    title="Delete profile"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (
                        confirm(
                          `Delete profile "${activeProfile.name}"? This cannot be undone.`,
                        )
                      ) {
                        deleteProfile(activeProfile.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>

          <DiceModifiersTable
            modifiers={modifiers}
            setModifiers={updateActiveProfileModifiers}
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
              <TableRow>
                <TableCell className="text-left font-medium">
                  Final Value
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {finalTotal}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-left font-semibold">
                  {Number(targetToBeat) >= minPossibleRoll &&
                  Number(targetToBeat) <= maxPossibleRoll
                    ? "POSSIBLE"
                    : "NOT POSSIBLE"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {Number(targetToBeat)}
                </TableCell>
              </TableRow>
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

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingProfileId ? "Rename Profile" : "Create New Profile"}
            </DialogTitle>
          </DialogHeader>

          <Input
            autoFocus
            placeholder="Profile name"
            value={profileNameDraft}
            onChange={(e) => setProfileNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitProfileDialog();
            }}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProfileDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitProfileDialog}>
              {editingProfileId ? "Rename" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;

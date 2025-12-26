import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { Input } from "@/components/ui/input";

type DiceSelectorProps = {
  number: number;
  label: string;
  value: number;
  onChange: (value: number | undefined) => void;
};

export function DiceSelector({ label, value, onChange }: DiceSelectorProps) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">{label}</div>
        <div>
          <ToggleGroup
            type="single"
            size="sm"
            value={value.toString()}
            variant={"outline"}
            onValueChange={(value) => {
              onChange(Number(value));
            }}
          >
            <ToggleGroupItem value={"1"} aria-label="Toggle 1">
              <Dice1 />
            </ToggleGroupItem>
            <ToggleGroupItem value={"2"} aria-label="Toggle 2">
              <Dice2 />
            </ToggleGroupItem>
            <ToggleGroupItem value={"3"} aria-label="Toggle 3">
              <Dice3 />
            </ToggleGroupItem>
            <ToggleGroupItem value={"4"} aria-label="Toggle 4">
              <Dice4 />
            </ToggleGroupItem>
            <ToggleGroupItem value={"5"} aria-label="Toggle 5">
              <Dice5 />
            </ToggleGroupItem>
            <ToggleGroupItem value={"6"} aria-label="Toggle 6">
              <Dice6 />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Input
          type="number"
          min={1}
          max={6}
          placeholder={label}
          defaultValue={1}
          value={value}
          onValueChange={(numericChange) => {
            onChange(numericChange.value as number);
          }}
        />
      </div>
    </>
  );
}

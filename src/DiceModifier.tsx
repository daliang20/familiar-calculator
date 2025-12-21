import { Label } from "@/components/ui/label"
import { NumberInput } from "./NumericInput"

type DiceModifierValue = {
    multiplier: number
    diceTotal: number
    enabled: boolean
}

type DiceModifierProps = {
    value: DiceModifierValue
    onChange: (value: DiceModifierValue) => void
    onRemove?: () => void
}

export function DiceModifier({ value, onChange, onRemove }: DiceModifierProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border p-4">
            {/* Enable/Disable Checkbox */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={value.enabled}
                    onChange={(e) =>
                        onChange({ ...value, enabled: e.target.checked })
                    }
                    className="h-4 w-4"
                />
                <Label>Enable Modifier</Label>
            </div>

            <div className="flex items-end gap-4">
                {/* Dice Total Modifier */}
                <div className="flex flex-col gap-1">
                    <Label>+ Dice Total</Label>
                    <NumberInput
                        displayButtons={true}
                        stepper={1}
                        value={value.diceTotal}
                        onValueChange={(e) =>
                            onChange({ ...value, diceTotal: Number(e ?? 0) })
                        }
                        className="w-[140px]"
                        disabled={!value.enabled}
                    />
                </div>

                {/* Multiplier */}
                <div className="flex flex-col gap-1">
                    <Label>× Multiplier</Label>
                    <NumberInput
                        displayButtons={true}
                        min={0}
                        decimalScale={3}
                        stepper={0.2}
                        value={value.multiplier}
                        onValueChange={(e) => {
                            if (e) {
                                onChange({ ...value, multiplier: Number(e ?? 0) })
                            }
                        }
                        }
                        className="w-[140px]"
                        disabled={!value.enabled}
                    />
                </div>

                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="ml-auto text-sm text-destructive"
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    )
}

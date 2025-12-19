import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
                {/* Multiplier */}
                <div className="flex flex-col gap-1">
                    <Label>× Multiplier</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={value.multiplier}
                        onChange={(e) =>
                            onChange({ ...value, multiplier: Number(e.target.value) })
                        }
                        className="w-[140px]"
                        disabled={!value.enabled}
                    />
                </div>

                {/* Dice Total Modifier */}
                <div className="flex flex-col gap-1">
                    <Label>+ Dice Total</Label>
                    <Input
                        type="number"
                        step="1"
                        value={value.diceTotal}
                        onChange={(e) =>
                            onChange({ ...value, diceTotal: Number(e.target.value) })
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { NumberInput } from "./NumericInput"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "./components/ui/checkbox"

type Modifier = {
    multiplier: number
    diceTotal: number
    enabled: boolean
}

type DiceModifiersTableProps = {
    modifiers: Modifier[]
    setModifiers: (modifiers: Modifier[]) => void
}

export function DiceModifiersTable({
    modifiers,
    setModifiers,
}: DiceModifiersTableProps) {

    const addModifier = () => {
        setModifiers([
            ...modifiers,
            { multiplier: 0, diceTotal: 0, enabled: true }
        ])
    }

    const updateModifier = (index: number, value: Partial<Modifier>) => {
        setModifiers(modifiers.map((m, i) => (i === index ? { ...m, ...value } : m)))
    }

    const removeModifier = (index: number) => {
        setModifiers(modifiers.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Added 'overflow-hidden' to ensure corners stick to the rounded border */}
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {/* Changed "On" to "Enabled" and increased width */}
                            <TableHead className="w-[80px] text-center">Enabled</TableHead>
                            <TableHead>Dice Total</TableHead>
                            <TableHead>Multiplier</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {modifiers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No modifiers added.
                                </TableCell>
                            </TableRow>
                        ) : (
                            modifiers.map((modifier, index) => (
                                <TableRow key={index} className="border-b last:border-0 hover:bg-muted/50">
                                    {/* Checkbox Column */}
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={modifier.enabled}
                                            onChange={(e) =>
                                                updateModifier(index, { enabled: e.target.checked })
                                            }
                                            className="h-4 w-4 accent-primary cursor-pointer"
                                        />
                                    </TableCell>

                                    {/* Dice Total Input */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground font-medium w-4">+</span>
                                            <NumberInput
                                                displayButtons={true}
                                                stepper={1}
                                                value={modifier.diceTotal}
                                                onValueChange={(e) =>
                                                    updateModifier(index, { diceTotal: Number(e ?? 0) })
                                                }
                                                className="w-[140px]"
                                                disabled={!modifier.enabled}
                                            />
                                        </div>
                                    </TableCell>

                                    {/* Multiplier Input */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground font-medium w-4">×</span>
                                            <NumberInput
                                                displayButtons={true}
                                                min={0}
                                                decimalScale={3}
                                                stepper={0.2}
                                                value={modifier.multiplier}
                                                onValueChange={(e) => {
                                                    if (e !== undefined) {
                                                        updateModifier(index, { multiplier: Number(e ?? 0) })
                                                    }
                                                }}
                                                className="w-[140px]"
                                                disabled={!modifier.enabled}
                                            />
                                        </div>
                                    </TableCell>

                                    {/* Remove Action */}
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeModifier(index)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
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
    )
}
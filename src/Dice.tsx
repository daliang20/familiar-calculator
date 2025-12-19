import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type DiceSelectorProps = {
    label: string
    value: number
    onChange: (value: number) => void
}

export function DiceSelector({
    label,
    value,
    onChange,
}: DiceSelectorProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
                {label}
            </label>

            <Select
                value={value === 0 ? undefined : value.toString()}
                onValueChange={(v) => onChange(Number(v))}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Dice Roll" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

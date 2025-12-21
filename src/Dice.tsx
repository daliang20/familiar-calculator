import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { NumberInput } from './NumericInput';


import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices } from 'lucide-react'


type DiceSelectorProps = {
    number: number
    label: string
    value: number
    onChange: (value: number | undefined) => void
}



export function DiceSelector({
    number,
    label,
    value,
    onChange,
}: DiceSelectorProps) {

    const icon = ((diceNumber: number) => {
        switch (diceNumber) {
            case 1:
                return <Dice1 />
            case 2:
                return <Dice2 />
            case 3:
                return <Dice3 />
            default:
                return <Dices />
        }
    })(number);

    return (
        <>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    {label}
                </div>
                <div>
                    <ToggleGroup type="single" size="sm" value={value.toString()} variant={"outline"}
                        onValueChange={(value) => {
                            onChange(Number(value))
                        }}>
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
                <NumberInput min={1} max={6} placeholder={label} defaultValue={1} value={value} onValueChange={onChange} displayButtons={false} />

            </div >

        </>
    )
}

import { NumberInput } from './NumericInput';


import { Dice1, Dice2, Dice3, Dices } from 'lucide-react'


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
                    {icon}
                    {label}
                </div>
                <NumberInput min={1} max={6} placeholder={label} defaultValue={1} value={value} onValueChange={onChange} displayButtons={false} />

            </div>

        </>
    )
}

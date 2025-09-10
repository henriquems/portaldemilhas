import { ReactNode } from "react"

interface CardRelatorioProps {
    descricao: string
    valor: number | string
    icon: ReactNode
}

export default function CardRelatorio(props: CardRelatorioProps) {
    const { descricao, valor, icon } = props
 
    return (
        <div className="flex items-center justify-between 
            bg-zinc-700 rounded-md p-4">
            <div className="flex flex-col gap-1">
                <div className="text-zinc-300 font-semibold lg:text-lg">{descricao}</div>
                <div className="text-orange-400 font-bold lg:text-3xl">{valor}</div>
            </div>
            <div className="text-zinc-300">{icon}</div>
        </div>
    )
}
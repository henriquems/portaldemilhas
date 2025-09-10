import { IconChevronLeft } from "@tabler/icons-react"
import Link from "next/link"
import { ReactNode } from "react"

export interface CardProps {
    icon?: ReactNode
    titulo?: string
    descricaoLink?: string
    caminhoLink?: string
    children: React.ReactNode
    tamanho?: "pequeno" | "grande"
    classe?: string
} 

export default function Card(props: CardProps) {
    return (
        <div className={`flex flex-col items-center  
            p-2 lg:p-4 rounded-xl
            ${`bg-zinc-800 ${props.classe ?? ''}`}
            ${props.tamanho === 'pequeno' ? 'w-[50%]' : 'w-full'}
        `}>
            <div className="flex flex-col gap-2 w-full">
                <div className={`flex justify-between font-semibold 
                    ${props.titulo ? "border-b border-b-zinc-700 pb-3" : ""}`}
                >
                    <div className="flex items-center gap-1">
                        {props.icon ? props.icon : ""}
                        {props.titulo}
                    </div>
                    <div className="flex items-center">
                        {!props.descricaoLink ? null : (
                            <Link href={props.caminhoLink ?? ""} className="flex gap-1 link">
                                <IconChevronLeft width={20} height={20} stroke={1.5} />
                                {props.descricaoLink}
                            </Link>
                        )}    
                    </div>
                </div>
                <div className={`${props.titulo ? 'mt-2' : ''} pb-2`}>{props.children}</div>
            </div>
        </div>
    )
}
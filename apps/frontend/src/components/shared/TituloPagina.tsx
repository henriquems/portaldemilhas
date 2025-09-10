'use client'
import { IconCirclePlus, IconUser } from "@tabler/icons-react"
import useSessao from "@/data/hooks/useSessao"
import Link from "next/link"

export interface TituloPaginaProps {
    icone: React.ReactElement
    descricao: string
    labelBotao?: string
    urlBotao?: string
    quantidadeRegistros?: number
}

export default function TituloPagina(props: TituloPaginaProps) {
    const { usuario } = useSessao();
    return (
        <div className="flex items-center justify-between mb-7 gap-2 lg:gap-4">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                    <div className="text-slate-500">{props.icone}</div>
                    <span className="text-slate-500 font-semibold">{props.descricao}</span>
                    { (props.quantidadeRegistros ?? 0) > 0 && (
                    <span className="text-slate-400 text-xs">
                        {`( ${props.quantidadeRegistros} )`}
                    </span>
                    )}
                </div>
                
                { usuario && (
                    <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                        <div><IconUser size={16} /></div>
                        <div>{usuario?.email}</div>
                    </div>
                )}
            </div>
            
            <div>
                { props.labelBotao && 
                    <Link href={props.urlBotao ?? ""} 
                        className="flex items-center justify-center botao primario h-9">
                        <IconCirclePlus width={18} height={18} stroke={2} />
                        {props.labelBotao}
                    </Link> 
                }
            </div>
        </div>
    )
}


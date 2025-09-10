import { Programa } from "@portaldemilhas/core";
import { IconChecks, IconPlaneDeparture } from "@tabler/icons-react";

interface CardProgramaProps {
  programa: Programa;
  selecionado: boolean;
  onSelecionar: (programa: Programa) => void;
}

export default function CardPrograma({ programa, selecionado, onSelecionar }: CardProgramaProps) {
    
    return (
        <div onClick={() => onSelecionar(programa)}
            className={`flex flex-col items-center justify-center 
                gap-1 cursor-pointer p-2 border rounded-lg
                ${selecionado ? "bg-blue-700 border-blue-700" : "bg-zinc-600 border-zinc-600"}
                hover:bg-blue-700 hover:border-blue-700 transition-colors`}
        >
            <div className="flex items-center gap-1">
                {selecionado && (
                    <IconChecks size={28} stroke={3} className="text-orange-500" />
                )}
                
                {!selecionado && (
                    <IconPlaneDeparture size={28} stroke={2} className="text-white" />
                )}
            </div>
            <div className="flex flex-col justify-center items-center gap-1">
                <span className="font-semibold">{programa.descricao}</span>
                <span>({programa.companhia})</span>
            </div>
        </div>
    );
}

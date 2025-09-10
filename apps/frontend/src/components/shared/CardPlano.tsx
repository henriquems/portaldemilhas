import { formatCurrencyBRL, Plano } from "@portaldemilhas/core";
import { IconChecks, IconLicense } from "@tabler/icons-react";

interface CardPlanoProps {
  plano: Plano;
  selecionado: boolean;
  onSelecionar: (plano: Plano) => void;
}

export default function CardPlano({ plano, selecionado, onSelecionar }: CardPlanoProps) {
    return (
        <div onClick={() => onSelecionar(plano)}
            className={`flex flex-col items-center justify-center 
                gap-1 cursor-pointer p-2 border rounded-lg
                ${selecionado ? "bg-blue-700 border-blue-700" : "bg-zinc-600 border-zinc-600"}
                hover:bg-blue-700 hover:border-blue-700 transition-colors`}
        >
            <div className="flex items-center justify-center gap-1">
                {selecionado && (
                    <IconChecks size={28} stroke={3} className="text-orange-500" />
                )}
                
                {!selecionado && (
                    <IconLicense size={28} stroke={2} className="text-white" />
                )}
            </div>
            
            <div className="flex flex-col justify-center items-center gap-1">
                <span className="font-semibold text-center">{ plano.descricao }</span>
                <span className="font-semibold text-center">{ formatCurrencyBRL(plano.valor) }</span>
            </div>
        </div>
    );
}

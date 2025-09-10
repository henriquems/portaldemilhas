'use client'
import { DataTable } from "./data-table"
import { IconUsers } from "@tabler/icons-react";
import { columns } from "./columns";
import usePlano from "@/data/hooks/usePlano";
import TituloPagina from "@/components/shared/TituloPagina";

export default function PesquisaPlano() {
    const { planos, page, pageSize, total, carregando, excluir } = usePlano();
    
    return (
        <div>
            <TituloPagina 
                icone={<IconUsers width={20} height={20} />} 
                descricao="Planos"
                quantidadeRegistros={total}
                labelBotao="Plano"
                urlBotao="/plano/cadastro"
            />
            
            <DataTable 
                columns={columns(excluir)} 
                data={planos} 
                page={page} 
                pageSize={pageSize} 
                totalCount={total}
                carregando={carregando}
            />
        </div>
      )
}
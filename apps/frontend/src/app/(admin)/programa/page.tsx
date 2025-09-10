'use client'
import TituloPagina from "@/components/shared/TituloPagina";
import usePrograma from "@/data/hooks/usePrograma";
import { DataTable } from "./data-table"
import { IconUsers } from "@tabler/icons-react";
import { columns } from "./columns";

export default function PesquisaPrograma() {
    const { programas, page, pageSize, total, carregando, excluir } = usePrograma();
    
    return (
        <div>
            <TituloPagina 
                icone={<IconUsers width={20} height={20} />} 
                descricao="Programas"
                quantidadeRegistros={total}
                labelBotao="Novo"
                urlBotao="/programa/cadastro"
            />
            
            <DataTable 
                columns={columns(excluir)} 
                data={programas} 
                page={page} 
                pageSize={pageSize} 
                totalCount={total} 
                carregando={carregando}
            />
        </div>
      )
}
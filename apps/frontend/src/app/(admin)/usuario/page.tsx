'use client'
import useUsuarios from "@/data/hooks/useUsuario";
import TituloPagina from "@/components/shared/TituloPagina";
import { DataTable } from "./data-table"
import { IconUsers } from "@tabler/icons-react";
import { columns } from "./columns";

export default function PesquisaUsuario() {
    const { usuarios, page, pageSize, total, perfis, carregando, excluir, listar } = useUsuarios()

    return (
        <div>
            <TituloPagina 
                icone={<IconUsers width={20} height={20} />} 
                descricao="Usuários"
                quantidadeRegistros={total}
                labelBotao="Novo"
                urlBotao="/usuario/cadastro"
            />
            
            <DataTable 
                columns={columns(excluir)} 
                data={usuarios} 
                page={page} 
                pageSize={pageSize} 
                totalCount={total} 
                perfis={perfis}
                carregando={carregando}
                listar={listar}
            />
        </div>
      )
}
'use client'
import { DataTable } from "./data-table"
import { IconCertificate } from "@tabler/icons-react";
import { columns } from "./columns";
import useCupom from "@/data/hooks/useCupom";
import useUsuarioInfluencer from "@/data/hooks/useUsuarioInfluencer";
import TituloPagina from "@/components/shared/TituloPagina";

export default function PesquisaCupom() {
    const { cupons, page, pageSize, total, carregando, excluir, listar } = useCupom();
    const { usuarioInfluencers } = useUsuarioInfluencer();

    return (
        <div>
            <TituloPagina 
                icone={<IconCertificate width={20} height={20} />} 
                descricao="Cupons"
                quantidadeRegistros={total}
                labelBotao="Novo"
                urlBotao="/cupom/cadastro"
            />

            <DataTable 
                columns={columns(excluir)} 
                data={cupons} 
                page={page} 
                pageSize={pageSize} 
                totalCount={total} 
                carregando={carregando}
                usuarios={usuarioInfluencers}
                listar={listar}
            />
        </div>
      )
}
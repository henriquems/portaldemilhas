'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IconExclamationCircle, IconReceiptDollar, IconShoppingCartDollar, IconTagStarred } from "@tabler/icons-react";
import Link from "next/link";
import TituloPagina from "@/components/shared/TituloPagina";
import Card from "@/components/shared/Card";
import useAssinatura from "@/data/hooks/useAssinatura";
import { formatDateTimeBR } from "@portaldemilhas/core";

export default function SucessoPagamento() {
  const { recuperarAssinatura } = useAssinatura();
  const params = useParams();
  const [dados, setDados] = useState<{
    plano: string;
    valor: number;
    status: string;
    vencimento: string;
  }>();

  useEffect(() => {
    const carregar = async () => {
      const assinaturaId = Number(params?.id);
      if (!isNaN(assinaturaId)) {
        const assinatura = await recuperarAssinatura(assinaturaId);
        if (assinatura) {
          setDados({
            plano: assinatura.plano?.descricao ?? '',
            valor: assinatura.valor ?? 0,
            status: assinatura.status ?? '',
            vencimento: formatDateTimeBR(assinatura.dataVencimento),
          });
        }
      }
    };
    carregar();
  }, [params?.id, recuperarAssinatura]);

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full lg:w-[50%]">
        <TituloPagina icone={<IconReceiptDollar />} descricao="Pagamento" />

        <Card icon={<IconExclamationCircle />} titulo="Sucesso">
          <div>
            <div className="flex flex-col gap-1">
                <span className="text-lg text-blue-500">Pagamento realizado com sucesso!</span>
                <span className="text-slate-300">
                  A partir de agora você já pode acessar as áreas exclusivas do site!
                </span>
            </div>            
            
            {dados && (
              <div className="flex flex-col gap-1 mt-5">
                <div>
                  <span className="text-slate-300 font-semibold">Dados da Assinatura</span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-slate-300">
                  <span>Plano: {dados.plano}</span>
                  <span>Valor: R${dados.valor.toFixed(2)}</span>
                  <span>Status: {dados.status}</span>
                  <span>Vencimento: {dados.vencimento}</span>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-5">
              <Link href="/anuncio" className="botao secundario w-full">
                <IconShoppingCartDollar width={18} height={18} />
                <span>Anuncios</span>
              </Link>

              <Link href="/anuncio/cadastro" className="botao secundario w-full">
                <IconTagStarred width={18} height={18} />
                <span>Anunciar</span>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
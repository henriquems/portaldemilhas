'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { toast } from 'react-toastify';
import Pagamento from '@/components/shared/Pagamento';
import useAssinatura from '@/data/hooks/useAssinatura';
import useSessao from '@/data/hooks/useSessao';
import TituloPagina from '@/components/shared/TituloPagina';
import { IconCashRegister } from '@tabler/icons-react';
import { Plano } from '@portaldemilhas/core';
import Processando from '@/components/shared/Processando';

type PaginaPagamentoProps = {
  params: Promise<{ id?: string[] }>;
};

type AssinaturaData = {
  id: number;
  valor: number;
  plano?: Plano;
};

export default function PaginaPagamento({ params }: PaginaPagamentoProps) {
  const resolvedParams = use(params);
  const { recuperar } = useAssinatura();
  const { usuario } = useSessao();
  const [assinatura, setAssinatura] = useState<AssinaturaData | null>(null);

  useEffect(() => {
    async function carregarAssinatura() {
      if (!resolvedParams?.id?.[0]) return;

      try {
        const assinaturaRecuperada = await recuperar(Number(resolvedParams.id[0]));
        if (!assinaturaRecuperada?.id) throw new Error();

        setAssinatura({
          id: assinaturaRecuperada.id,
          valor: assinaturaRecuperada.plano?.valor ?? 0,
          plano: assinaturaRecuperada.plano
        });
      } catch {
        toast.error('Erro ao carregar dados da assinatura');
      }
    }

    carregarAssinatura();
  }, [resolvedParams, recuperar]);

  const carregando = !assinatura || !usuario?.email || !assinatura.plano;

  return (
    <div>
      <TituloPagina icone={<IconCashRegister />} descricao="Pagamento" />
      
        {carregando ? (
          <Processando />
          ) : (
            <div className='p-2'>
              {assinatura.plano ? (
                <Pagamento
                  assinaturaId={assinatura.id}
                  valor={assinatura.valor}
                  plano={assinatura.plano}
                />
              ) : (
                <span className="text-red-500">Erro ao carregar informações do plano.</span>
              )}
            </div>
          )}
      
    </div>
  );
}

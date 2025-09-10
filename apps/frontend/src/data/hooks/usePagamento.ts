import { useCallback, useEffect, useMemo, useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { toast } from 'react-toastify';
import { QrCodePix, DadosPagamentoCartaoComToken, Plano, Cupom } from '@portaldemilhas/core';
import { HttpErro } from '@/errors/HttpErro';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSessao from '@/data/hooks/useSessao';
import useAPI from '@/data/hooks/useAPI';
import { useRouter } from 'next/navigation';

interface Props {
  assinaturaId: number;
  valor: number;
  plano: Plano;
}

const cupomSchema = z.object({
    cupom: z.string().min(1, { message: "Favor informar o campo cupom!" }),
});

export default function usePagamento({ assinaturaId, valor, plano }: Props) {
  const router = useRouter();
  const { usuario, token } = useSessao();
  const { httpGet, httpPost } = useAPI();
  const [ cupom, setCupom ] = useState<Cupom>() 
  const [emailUsuario, setEmailUsuario] = useState(usuario?.email ?? '');
  const [cpf, setCpf] = useState(usuario?.cpf ?? '');
  const [metodo, setMetodo] = useState<'cartao' | 'pix' | 'boleto'>('cartao');
  const [sdkInicializado, setSdkInicializado] = useState(false);
  const [qrCodePix, setQrCodePix] = useState<QrCodePix | null>(null);
  const [idPagamento, setIdPagamento] = useState<number | null>(null);
  const [openPixModal, setOpenPixModal] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [processandoCupom, setProcessandoCupom] = useState(false);

  const form = useForm<z.infer<typeof cupomSchema>>({
      resolver: zodResolver(cupomSchema),
      defaultValues: {
          cupom: "",
      }
  })

  useEffect(() => {
    if (!sdkInicializado) {
      initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || '', {
        locale: 'pt-BR',
      });
      setSdkInicializado(true);
    }
  }, [sdkInicializado]);

  useEffect(() => {
    if (!idPagamento || !['pix', 'boleto'].includes(metodo)) return;

    const interval = setInterval(async () => {
      try {
        const res = await httpGet<{ status: string }>(`/api/pagamento/status/${idPagamento}`);
        const status = res.status?.toLowerCase?.();

        if (status === 'approved') {
          clearInterval(interval);
          window.location.href = `/pagamento/sucesso/${assinaturaId}`;
        } else if (['rejected', 'cancelled'].includes(status)) {
          clearInterval(interval);
          window.location.href = `/pagamento/falha/${assinaturaId}`;
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      }
    }, 5000);

    const timeout = setTimeout(() => clearInterval(interval), 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [idPagamento, assinaturaId, metodo, httpGet]);

  const onSubmit = useCallback(
    async (dados: DadosPagamentoCartaoComToken) => {
      try {
        const res = await httpPost<{ status: string }>(`/api/pagamento/cartao`, {
          token: dados.token,
          payment_method_id: dados.paymentMethodId,
          installments: dados.installments,
          email: emailUsuario,
          valor,
          assinaturaId,
          descricao: plano.descricao,
          nomeCliente: dados.cardholderName?.trim() || usuario?.nome || 'Não Informado',
          identificationNumber: cpf,
        });

        const rota =
          res.status === 'approved'
            ? 'sucesso'
            : res.status === 'pending'
            ? 'pendente'
            : 'falha';

        window.location.href = `/pagamento/${rota}/${assinaturaId}`;
      } catch (error) {
        if (error instanceof HttpErro) {
          toast.error(`Erro ao processar pagamento: ${error.getMensagem()}`);
        } else {
          console.error('Erro inesperado:', error);
          toast.error('Erro inesperado ao processar pagamento.');
        }
      }
    },
    [assinaturaId, valor, plano, emailUsuario, cpf, usuario?.nome, httpPost]
  );

  const iniciarPagamento = async (metodo: 'pix' | 'boleto') => {
    setProcessando(true);
    try {
      const valorFinal = cupom ? valor - (valor * cupom.valorDesconto) / 100 : valor;
      
      const res = await httpPost<{url: string; idPagamento: number; qrCodeBase64?: string; code?: string;}>(`/api/pagamento/${metodo}`, {
        assinaturaId,
        valor: valorFinal,
        email: emailUsuario,
        descricao: plano.descricao,
        identificationNumber: cpf,
        nomeCliente: usuario?.nome ?? 'Não Informado',
      });

      setIdPagamento(res.idPagamento);

      if (metodo === 'pix') {
        setQrCodePix({ base64: res.qrCodeBase64 || '', code: res.code || '' });
        setOpenPixModal(true);
      } else {
        window.open(res.url, '_blank');
      }
    } catch (err) {
      console.error('Erro ao iniciar pagamento:', err);
      toast.error('Erro ao iniciar o pagamento.');
    } finally {
      setProcessando(false);
    }
  };

  const verificarCupom = async () => {
      try {
        setProcessandoCupom(true);
        const cupomInformado = form.getValues("cupom")
        const cupomRetornado = await httpGet<Cupom>(`/cupons/verificar/${cupomInformado}`);
        
        if (cupomRetornado?.id != null) {
          setCupom(cupomRetornado)
          await aplicarCupom(cupomRetornado.id);
          toast.success(`Cupom "${cupomRetornado.descricao}" aplicado com sucesso!`);
          if (cupomRetornado.valorDesconto === 100) {
            router.push('/'); 
          }
        }
      } catch (err: unknown) {
        let mensagem = 'Erro ao validar cupom!';

        if (err instanceof HttpErro) {
          mensagem = err.getMensagem();
        } else if (err instanceof Error) {
          mensagem = err.message;
        } else if (typeof err === 'object' && err !== null) {
          const e = err as { response?: { data?: { mensagem?: string; message?: string } }; mensagem?: string };
          mensagem =
            e.mensagem ||
            e.response?.data?.mensagem ||
            e.response?.data?.message ||
            mensagem;
        }

        toast.error(mensagem);
      } finally {
        setProcessandoCupom(false);
      }
  }

  const aplicarCupom = async (cupomId: number) => {
    await httpPost(`/assinaturas/${assinaturaId}/aplicar-cupom`, { cupomId });
  };

  return { 
      form, usuario, token, emailUsuario, setEmailUsuario,
      cpf, setCpf, metodo, setMetodo, onSubmit, iniciarPagamento,
      qrCodePix, idPagamento, openPixModal, setOpenPixModal, processando, 
      processandoCupom, verificarCupom, cupom,
      initialization: useMemo(() => ({ amount: valor }), [valor]),
      customization: useMemo(
        () => ({
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                baseColor: '#2b7fff',
                errorColor: '#ef4444',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
              },
            },
          },
        }),
      []
    ),
  };
}

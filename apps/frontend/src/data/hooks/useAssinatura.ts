import { useCallback, useEffect, useState } from "react";
import { Assinatura, Paginacao } from "@portaldemilhas/core";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation'
import useAPI from "./useAPI";
import usePlano from "./usePlano";
import useSessao from "./useSessao";

const planoSchema = z.object({
  id: z.number({
    required_error: "Favor selecionar um plano!",
    invalid_type_error: "Plano inválido!"
  }),
  descricao: z.string().min(1, "Favor informar a descrição do plano!"),
});

const assinaturaSchema = z.object({
  id: z.number().optional(),
  plano: planoSchema.refine(
    (p) => p.id > 0 && p.descricao.length > 0,
    { message: "Favor selecionar um plano!" }
  ).or(z.undefined().refine(() => false, {
    message: "Favor selecionar um plano!",
  })),
});

export default function useAssinatura() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { httpGet, httpPost, httpDelete, httpPatch } = useAPI();
  const { planos } = usePlano();
  const { usuario, isAdministrador, iniciarSessao } = useSessao();
  const router = useRouter();

  const [assinatura, setAssinatura] = useState<Pick<Assinatura, "id" | "valor" | "plano"> | null>(null);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  
  const [planoSelecionado, setPlanoSelecionado] = useState<number | null>(
    searchParams.get("planoId") ? Number(searchParams.get("planoId")) : null
  );

  const page: number = parseInt(searchParams.get("page") || "1");
  const pageSize: number = parseInt(searchParams.get("pageSize") || "10");

  const form = useForm<z.infer<typeof assinaturaSchema>>({
    resolver: zodResolver(assinaturaSchema),
    defaultValues: {
      plano: undefined,
    },
  });

  const salvar = async () => {
    try {
      setProcessando(true);

      const resposta = await httpPost<{ id: number; token?: string }>('/assinaturas/cadastro', {
        id: form.getValues('id'),
        usuario,
        plano: form.getValues('plano'),
        status: 'AGUARDANDO',
        data: new Date(),
      });

      const { id: assinaturaId, token } = resposta;

      if (token) {
        localStorage.setItem('token', token);
        iniciarSessao(token);
      }

      if (assinaturaId) {
        toast.success('Redirecionando para pagamento...');
        router.push(`/pagamento/${assinaturaId}`);
      } else {
        toast.error('Não foi possível iniciar o pagamento.');
      }
    } catch (erro) {
      toast.error('Erro ao salvar a assinatura.');
      console.error('Erro ao salvar assinatura:', erro);
    } finally {
      setProcessando(false);
    }
  }

  const pagar = async (assinaturaId: number) => {
    try {
      const resposta = await httpPost<{ url: string }>(`/assinaturas/pagamento`, {
        id: assinaturaId,
      });

      if (resposta?.url) {
        toast.success('Redirecionando para pagamento...');
        router.push(`/pagamento/${assinaturaId}`);
      } else {
        toast.error('Não foi possível redirecionar para o pagamento.');
      }
    } catch (erro) {
      toast.error('Erro ao redirecionar para o pagamento.');
      console.error('Erro ao pagar assinatura:', erro);
    }
  }

  const listar = useCallback(async () => {
    setCarregando(true);
    try {
      let url = isAdministrador()
        ? `/assinaturas?page=${page}&pageSize=${pageSize}`
        : `/assinaturas/usuario?page=${page}&pageSize=${pageSize}`;

      if (planoSelecionado) {
        url += `&planoId=${planoSelecionado}`;
      }

      const resposta = await httpGet<Paginacao<Assinatura>>(url);
      setAssinaturas(resposta.itens ?? []);
      setTotal(resposta.total);
    } finally {
      setCarregando(false);
    }
  }, [httpGet, page, pageSize, isAdministrador, planoSelecionado]);

  const excluir = async (id: number) => {
    try {
      const resposta = await httpDelete<{ token?: string }>(`/assinaturas/${id}`);

      if (resposta?.token) {
        iniciarSessao(resposta.token)
        toast.success('Assinatura excluída com sucesso.');
      } else {
        toast.success('Assinatura excluída, mas sem atualização de token.');
      }
    } catch (error) {
      toast.error('Erro ao excluir assinatura.');
      console.error(error);
    }
  }

  const reset = form.reset;

  const recuperar = useCallback(
    async (id: number) => {
      
      const assinatura = await httpGet<Assinatura>(`/assinaturas/${id}`);
      if (assinatura) {
        reset({
          id: assinatura.id,
          plano: {
            id: assinatura.plano?.id ?? undefined,
            descricao: assinatura.plano?.descricao ?? "",
          },
        });
      }
      return assinatura;
    },
    [httpGet, reset]
  )

  const recuperarAssinatura = async (id: number) => {
    try {
      const assinaturaRecuperada = await httpGet<Assinatura>(`/assinaturas/${id}`);

      if (!assinaturaRecuperada.plano) {
        throw new Error("A assinatura recuperada não possui plano vinculado.");
      }

      setAssinatura({
        id: assinaturaRecuperada.id,
        valor: assinaturaRecuperada.valor,
        plano: assinaturaRecuperada.plano,
      });

      return assinaturaRecuperada;
    } catch (error) {
      toast.error("Erro ao recuperar assinatura: " + (error as Error).message);
      console.error("Erro recuperarAssinatura:", error);
      return null;
    }
  };

  const recuperarAssinaturaQueContemCupomDoUsuario = useCallback(async () => {
    setCarregando(true);
    try {
      const resposta = await httpGet<Paginacao<Assinatura>>(`/assinaturas/meusCupons?page=${page}&pageSize=${pageSize}`);
      setAssinaturas(resposta.itens ?? []);
      setTotal(resposta.total);
    } finally {
      setCarregando(false);
    }
  }, [httpGet, page, pageSize]);

  const alterarPagamentoInfluencer = async (id: number, novoValor: string, setChecked?: (valor: boolean) => void) => {
    try {
      await httpPatch(`/assinaturas/pagamentoInfluencer/${id}`, {
        pagamentoInfluencer: novoValor
      });

      if (setChecked) setChecked(novoValor === "PAGO");
    } catch (error) {
      console.error("Erro ao atualizar pagamentoInfluencer:", error);
      if (setChecked) setChecked(novoValor !== "PAGO");
    }
  };

  const recuperarTotalAssinaturaComCupom = useCallback(async () => {
    try {
      const resposta = await httpGet<number>(`/assinaturas/total-com-cupom`);
      return resposta;
    } catch (error) {
      toast.error("Erro ao recuperar total de assinaturas com cupom.");
      console.error("Erro recuperarTotalAssinaturaComCupom:", error);
      return 0;
    }
  }, [httpGet]);

  const recuperarTotalAssinaturaComCupomPago = useCallback(async () => {
    try {
      const resposta = await httpGet<number>(`/assinaturas/total-com-cupom-pago`);
      return resposta;
    } catch (error) {
      toast.error("Erro ao recuperar total de assinaturas com cupom pago.");
      console.error("Erro recuperarTotalAssinaturaComCupomPago:", error);
      return 0;
    }
  }, [httpGet]);

  const somarValorPagoComCupom = useCallback(async () => {
    try {
      const resposta = await httpGet<number>(`/assinaturas/soma-com-cupom-pago`);
      return resposta;
    } catch (error) {
      toast.error("Erro ao recuperar total de assinaturas com cupom pago.");
      console.error("Erro recuperarTotalAssinaturaComCupomPago:", error);
      return 0;
    }
  }, [httpGet]);

  const somarValorAPagarComCupom = useCallback(async () => {
    try {
      const resposta = await httpGet<number>(`/assinaturas/soma-com-cupom-a-pagar`);
      return resposta;
    } catch (error) {
      toast.error("Erro ao recuperar total de assinaturas com cupom a pagar.");
      console.error("Erro recuperarTotalAssinaturaComCupomAPagar:", error);
      return 0;
    }
  }, [httpGet]);

  useEffect(() => {
    if (params.id) {
      recuperar(Number(params.id));
    } else if (pathname === "/assinatura/cupom") {
      recuperarAssinaturaQueContemCupomDoUsuario();
    } else {
      listar();
    }
  }, [params.id, page, pageSize, planoSelecionado, listar, recuperar, pathname,recuperarAssinaturaQueContemCupomDoUsuario]);

  return {
    form,
    planos,
    assinaturas,
    planoSelecionado,
    setPlanoSelecionado,
    assinatura,
    setAssinatura,
    page,
    pageSize,
    total,
    carregando,
    processando,
    salvar,
    excluir,
    pagar,
    recuperar,
    recuperarAssinatura,
    alterarPagamentoInfluencer,
    usuario,
    isAdministrador,
    recuperarTotalAssinaturaComCupom,
    recuperarTotalAssinaturaComCupomPago,
    somarValorPagoComCupom,
    somarValorAPagarComCupom
  };
}

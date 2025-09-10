import { Cupom, Paginacao } from "@portaldemilhas/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAPI from "./useAPI";

const usuarioSchema = z.object({
  id: z.number(),
  nome: z.string().min(1, "Favor informar o campo usuário!"),
});

const cupomSchema = z.object({
    id: z.number().optional(),
    usuario: usuarioSchema.refine((u) => u.id > 0 && u.nome.length > 0, { message: "Favor informar o campo usuário!" }),
    descricao: z.string().min(1, { message: "Favor informar o campo descrição!" }),
    valorDesconto: z.coerce.number({ invalid_type_error: "Favor informar o campo valor desconto!" }),
    status: z.string().min(1, { message: "Favor informar o campo status!" }),
});

export default function useCupom() {
    const router = useRouter()
    const params = useParams()
    const { httpGet, httpPost, httpDelete } = useAPI()
    const [ cupons, setCupons ] = useState<Cupom[]>([])
    const [ total, setTotal ] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const carregado = useRef(false);
    
    const searchParams = useSearchParams()
    const page: number = parseInt(searchParams.get('page') || "1")
    const pageSize: number = parseInt(searchParams.get('pageSize') || "10")

    const form = useForm<z.infer<typeof cupomSchema>>({
        resolver: zodResolver(cupomSchema),
        defaultValues: {
            usuario: undefined,
            descricao: "",
            valorDesconto: undefined,
            status: ""
        }
    })

    const salvar = async () => {
        await httpPost('/cupons/cadastro', {
            id: form.getValues("id"),
            usuario: form.getValues('usuario'),
            descricao: form.getValues("descricao"), 
            valorDesconto: form.getValues("valorDesconto"),
            status: form.getValues("status"), 
        })
        toast.success("Cupom salvo com sucesso!")
        router.push("/cupom")
    }
    
    const listar = useCallback(
      async function (filtros?: { nome?: string; descricao?: string; valorDesconto?: number; status?: string }) {
        setCarregando(true);
        try {
          const query = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...(filtros?.nome ? { nome: filtros.nome } : {}),
            ...(filtros?.descricao ? { descricao: filtros.descricao } : {}),
            ...(filtros?.valorDesconto ? { valorDesconto: filtros.valorDesconto.toString() } : {}),
            ...(filtros?.status ? { status: filtros.status } : {}),
          }).toString();

          const resposta = await httpGet<Paginacao<Cupom>>(`/cupons?${query}`);
          setCupons(resposta.itens ?? []);
          setTotal(resposta.total);
        } finally {
          setCarregando(false);
        }
      },
      [httpGet, page, pageSize]
    );

    const excluir = async (id: number) => {
      await httpDelete(`/cupons/${id}`)
      setCupons(cupons.filter((cupom) => cupom.id !== id))
      setTotal(total - 1);
      toast.success("Cupom excluído com sucesso!")
    }

    const reset = form.reset;

    const recuperar = useCallback(async (id: number) => {
      const cupom = await httpGet<Cupom>(`/cupons/${id}`);
      if (cupom) {
          reset({
              id: cupom.id,
              usuario: cupom.usuario || undefined,
              descricao: cupom.descricao || "",
              valorDesconto: Number(cupom.valorDesconto ?? 0),
              status: cupom.status || ""
          });
      }},[httpGet, reset]
    );

    useEffect(() => {
      if (params.id && !isNaN(Number(params.id))) {
        recuperar(Number(params.id));
      } else {
        listar();
      }
      carregado.current = true;
    }, [params.id, page, pageSize, listar, recuperar]);

    return {
       form, cupons, page, pageSize, total, carregando, salvar, excluir, listar
    }
}
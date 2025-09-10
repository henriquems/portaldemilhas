import { useCallback, useEffect, useState } from "react";
import { Anuncio, Paginacao, StatusAnuncio, StatusAnuncioTipo, TipoAnuncioTipo } from "@portaldemilhas/core";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpErro } from "@/errors/HttpErro";
import { toast } from "react-toastify";
import { z } from "zod";
import useSessao from "./useSessao";
import useAPI from "./useAPI";
import usePrograma from "./usePrograma";
import { isErroHttpData } from "@/errors/HttpUtils";

const programaSchema = z.object({
   id: z.number(),
   descricao: z.string().min(1, "Favor informar o programa!"),
   companhia: z.string().min(1, "Favor informar a companhia!"),
});

const anuncioSchema = z.object({
  id: z.number().optional(),
  programa: programaSchema.refine(
    (p) => p.id > 0 && p.descricao.length > 0 && p.companhia.length > 0,
    { message: "Favor informar o programa!" }
  ),
  tipo: z.string().min(1, { message: "Favor informar o tipo!" }),
  quantidadeMilhas: z.coerce.number({ invalid_type_error: "Favor informar a quantidade!" }),
  valor: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.coerce.number({ invalid_type_error: "Favor informar um valor numérico!" }).optional()
  ) as z.ZodType<number | undefined>,
  status: z.enum(Object.keys(StatusAnuncio) as [StatusAnuncioTipo, ...string[]]).optional(),
});

export default function useAnuncio() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [ total, setTotal ] = useState(0);
  const [ anuncios, setAnuncios ] = useState<Anuncio[]>([]);
  const [ programaSelecionado, setProgramaSelecionado ] = useState<number | null>(null);
  const [ tipoSelecionado, setTipoSelecionado ] = useState<string | null>(null);
  const [quantidadeMinima, setQuantidadeMinima] = useState<number | null>(null);
  const [inputLocal, setInputLocal] = useState<string>("");
  const [ carregando, setCarregando ] = useState(false);
  const { httpGet, httpPost, httpDelete } = useAPI();
  const { programas } = usePrograma();
  const { usuario } = useSessao();

  const searchParams = useSearchParams();
  const page: number = parseInt(searchParams.get("page") || "1");
  const pageSize: number = parseInt(searchParams.get("pageSize") || "10");

  const form = useForm<z.infer<typeof anuncioSchema>>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: {
      programa: { id: 0, descricao: "", companhia: "" },
      tipo: "",
      quantidadeMilhas: undefined,
      valor: undefined,
      status: "ATIVO"
    },
  });

  const salvar = async () => {
    await httpPost("/anuncios/cadastro", {
      id: form.getValues("id"),
      programa: form.getValues("programa"),
      usuario: usuario,
      tipo: form.getValues("tipo") as TipoAnuncioTipo,
      quantidadeMilhas: Number(form.getValues("quantidadeMilhas")),
      valor: Number(form.getValues("valor")),
      status: form.getValues("status") as StatusAnuncioTipo,
      data: new Date(),
    });
    toast.success("Anuncio salvo com sucesso!");
    router.push("/anuncio/usuario");
  };

  const salvarComStatus = async () => {
      try {
        setCarregando(true);
        await salvar();
      } finally {
        setCarregando(false);
      }
  }

  const excluir = async (id: number) => {
    await httpDelete(`/anuncios/${id}`);
    setAnuncios(anuncios.filter((anuncio) => anuncio.id !== id));
    setTotal(total - 1);
    toast.success("Anuncio excluído com sucesso!");
  };

  const recuperar = useCallback(
    async (id: number) => {
      try {
        const anuncio = await httpGet<Anuncio>(`/anuncios/${id}`);
        if (anuncio) {
          form.reset({
            id: anuncio.id,
            programa: {
              id: anuncio.programa?.id ?? undefined,
              descricao: anuncio.programa?.descricao ?? "",
              companhia: anuncio.programa?.companhia ?? "",
            },
            tipo: anuncio.tipo as TipoAnuncioTipo,
            quantidadeMilhas: Number(anuncio.quantidadeMilhas ?? 0),
            valor: Number(anuncio.valor ?? 0),
            status: anuncio.status as StatusAnuncioTipo,
          });
        }
      } catch (erro: unknown) {
        const err = erro as HttpErro;
        if (
          err instanceof HttpErro &&
          err.status === 403 &&
          isErroHttpData(err.data) &&
          err.data.message === "ASSINATURA_NAO_PAGA"
        ) {
          router.push("/pendente");
        } else {
          toast.error("Erro ao buscar dados");
        }
      }
    },
    [httpGet, form, router]
  );

  const listar = useCallback(async function () {
    let url = `/anuncios?page=${page}&pageSize=${pageSize}`;

    if (programaSelecionado) {
      url += `&programaId=${programaSelecionado}`;
    }

    if (tipoSelecionado) {
      url += `&tipo=${tipoSelecionado}`;
    }

    if (quantidadeMinima) {
      url += `&quantidadeMinima=${quantidadeMinima}`;
    }

    try {
      const resposta = await httpGet<Paginacao<Anuncio>>(url);
      setAnuncios(resposta.itens ?? []);
      setTotal(resposta.total);
    } catch (erro: unknown) {
      const err = erro as HttpErro;
      if (
        err instanceof HttpErro &&
        err.status === 403 &&
        isErroHttpData(err.data) &&
        err.data.message === "ASSINATURA_NAO_PAGA"
      ) {
        router.push("/pendente");
      } else {
        toast.error("Erro ao buscar dados");
      }
    }
  }, [httpGet, page, pageSize, programaSelecionado, tipoSelecionado, quantidadeMinima, router]);

  const listarPorUsuario = useCallback(async function () {
    let url = `/anuncios/usuario?page=${page}&pageSize=${pageSize}`;

    if (programaSelecionado) {
      url += `&programaId=${programaSelecionado}`;
    }

    const resposta = await httpGet<Paginacao<Anuncio>>(url);
    setAnuncios(resposta.itens ?? []);
    setTotal(resposta.total);
  }, [httpGet, page, pageSize, programaSelecionado]);

  const listarDestaques = useCallback(async function () {
    const resposta = await httpGet<Anuncio[]>("/anuncios/destaque");
    console.log(resposta.length)
    setAnuncios(resposta ?? []);
  }, [httpGet]);

  useEffect(() => {
    if (params.id && programas.length > 0) {
      setCarregando(true);
      recuperar(Number(params.id)).finally(() => setCarregando(false));
    } else if (!params.id) {
      if (pathname === "/anuncio") {
        setCarregando(true);
        listar().finally(() => setCarregando(false));
      } else if (pathname === "/anuncio/usuario") {
        setCarregando(true);
        listarPorUsuario().finally(() => setCarregando(false));
      } else if (pathname === "/") {
        setCarregando(true);
        listarDestaques().finally(() => setCarregando(false));
      } 
    }
  }, [params.id, programas, pathname, listar, listarDestaques, listarPorUsuario, recuperar,]);

  return {
    form, programas, anuncios, programaSelecionado, router, 
    params, carregando, setProgramaSelecionado, salvar, salvarComStatus, 
    excluir, tipoSelecionado, setTipoSelecionado, quantidadeMinima, setQuantidadeMinima,
    inputLocal, setInputLocal, usuario
  };
}

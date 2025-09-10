import { Paginacao, Usuario, validarCPF } from "@portaldemilhas/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { HttpErro } from "@/errors/HttpErro";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAPI from "./useAPI";
import usePerfil from "./usePerfil";

const perfilSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  descricao: z.string(),
});

const schemaBase = {
  id: z.number().optional(),
  status: z.string().min(1, { message: "Favor informar o campo status!" }),
  perfis: z.array(perfilSchema).min(1, "Favor informar o campo perfil!"),
  nome: z.string().min(1, { message: "Favor informar o campo nome!" }),
  cpf: z
    .string()
    .min(1, { message: "Favor informar o campo cpf!" })
    .refine((cpf) => validarCPF(cpf), {
      message: "CPF inválido!",
    }
  ),
  email: z.string().min(1, { message: "Favor informar o campo e-mail!" }),
  telefone: z.string().min(1, { message: "Favor informar o campo telefone!" }),
};

const schemaCriacao = z
  .object({
    ...schemaBase,
    senha: z.string().min(1, { message: "Favor informar o campo senha!" }),
    repitaSenha: z.string().min(1, { message: "Favor informar o campo repita senha!" }),
  })
  .refine((data) => data.senha === data.repitaSenha, {
    path: ["repitaSenha"],
    message: "As senhas não coincidem!",
  });

const schemaEdicao = z
  .object({
    ...schemaBase,
    senha: z.string().optional(),
    repitaSenha: z.string().optional(),
  })
  .refine((data) => {
    if (!data.senha && !data.repitaSenha) return true;
    if (data.senha && data.repitaSenha) return data.senha === data.repitaSenha;
    return false;
  }, {
    path: ["repitaSenha"],
    message: "As senhas não coincidem!",
  });


interface ErroComDetalhes {
  message?: string;
  data?: {
    detalhes?: string;
    message?: string;
  };
}

export default function useUsuario() {
  const router = useRouter();
  const params = useParams();
  const modoEdicao = !!params.id;
  const { perfis } = usePerfil();
  const { httpGet, httpPost, httpDelete } = useAPI();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const carregado = useRef(false);

  const searchParams = useSearchParams();
  const page: number = parseInt(searchParams.get("page") || "1");
  const pageSize: number = parseInt(searchParams.get("pageSize") || "10");

  const schema = useMemo(() => (modoEdicao ? schemaEdicao : schemaCriacao), [modoEdicao]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "",
      perfis: [],
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      senha: "",
      repitaSenha: "",
    },
  });

  const listar = useCallback(
    async function (filtros?: { nome?: string; cpf?: string; status?: string; perfil?: string }) {
      setCarregando(true);
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          ...(filtros?.nome ? { nome: filtros.nome } : {}),
          ...(filtros?.cpf ? { cpf: filtros.cpf } : {}),
          ...(filtros?.status ? { status: filtros.status } : {}),
          ...(filtros?.perfil ? { perfil: filtros.perfil } : {}),
        }).toString();

        const resposta = await httpGet<Paginacao<Usuario>>(`/usuarios?${query}`);
        setUsuarios(resposta.itens ?? []);
        setTotal(resposta.total);
      } finally {
        setCarregando(false);
      }
    },
    [httpGet, page, pageSize]
  );

  const salvar = async () => {
    try {
      await httpPost("/usuarios/cadastro", {
        id: form.getValues("id"),
        nome: form.getValues("nome"),
        email: form.getValues("email"),
        telefone: form.getValues("telefone"),
        senha: form.getValues("senha"),
        cpf: form.getValues("cpf"),
        status: form.getValues("status"),
        perfis: form.getValues("perfis"),
      });

      toast.success("Usuário salvo com sucesso!");
      router.push("/usuario");
    } catch (erro: unknown) {
      if (erro instanceof HttpErro) {
        const e = erro as ErroComDetalhes;
        const detalhesMensagem = e.data?.detalhes || e.data?.message || e.message || "";
        const msg = detalhesMensagem.toLowerCase();

        if (msg.includes("cpf")) {
          form.setError("cpf", { message: "Este CPF já está cadastrado." });
          toast.error("CPF já cadastrado.");
          return;
        }

        if (msg.includes("e-mail") || msg.includes("email")) {
          form.setError("email", { message: "Este e-mail já está cadastrado." });
          toast.error("E-mail já cadastrado.");
          return;
        }
      }

      toast.error("Erro ao salvar o usuário.");
    }
  };

  const excluir = async (id: number) => {
    await httpDelete(`/usuarios/${id}`);
    setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    setTotal(total - 1);
    toast.success("Usuário excluído com sucesso!");
  };

  const reset = form.reset;

  const recuperar = useCallback(
    async (id: number) => {
      const usuario = await httpGet<Usuario>(`/usuarios/${id}`);
      if (usuario) {
        reset({
          id: usuario.id,
          status: usuario.status || "",
          perfis: usuario.perfis || [],
          nome: usuario.nome || "",
          cpf: usuario.cpf || "",
          email: usuario.email || "",
          telefone: usuario.telefone || "",
          senha: "",
          repitaSenha: "",
        });
      }
    },
    [httpGet, reset]
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
    usuarios,
    page,
    pageSize,
    total,
    form,
    perfis,
    carregando,
    excluir,
    salvar,
    recuperar,
    listar,
  };
}

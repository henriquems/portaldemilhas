import { Usuario, validarCPF } from "@portaldemilhas/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAPI from "./useAPI";
import useSessao from "./useSessao";
import { HttpErro } from "@/errors/HttpErro";

interface DadosErro {
  detalhes?: string;
  message?: string;
}

const schemaBase = {
  id: z.number().optional(),
  nome: z.string().min(1, { message: "Favor informar o campo nome!" }),
  email: z.string().min(1, { message: "Favor informar o campo email!" }),
  cpf: z
    .string()
    .min(1, { message: "Favor informar o campo cpf!" })
    .refine((cpf) => validarCPF(cpf), {
      message: "CPF inválido!",
    }
  ),
  telefone: z.string().min(1, { message: "Favor informar o campo telefone!" }),
};

const schemaCriacao = z
  .object({
    ...schemaBase,
    senha: z.string().min(1, { message: "Favor informar o campo senha!" }),
    repitaSenha: z.string().min(1, { message: "Favor informar o campo repita senha!" }),
    aceitouTermo: z.boolean().refine((val) => val === true, {
      message: "Você deve concordar com o termo de uso!",
    }),
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

export default function useCadastro() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const { httpGet, httpPost } = useAPI();
  const { usuario } = useSessao();
  const modoEdicao = !!usuario?.id;

  const schema = useMemo(() => (modoEdicao ? schemaEdicao : schemaCriacao), [modoEdicao]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      senha: "",
      repitaSenha: "",
      ...(modoEdicao ? {} : { aceitouTermo: false }),
    },
  });

  const salvar = async () => {
    const codigoPerfil = (usuario?.id && usuario.perfis && usuario.perfis.length > 0)
      ? usuario.perfis[0].id : 2
    
    await httpPost("/usuarios/cadastro", {
      id: form.getValues("id"),
      nome: form.getValues("nome"),
      email: form.getValues("email"),
      telefone: form.getValues("telefone"),
      senha: form.getValues("senha"),
      cpf: form.getValues("cpf"),
      status: "ATIVO",
      perfis: [{ id: codigoPerfil }],
    });

    toast.success("Usuário salvo com sucesso!");
    
    router.push(usuario?.id ? "/" : "/login");
  };

  const salvarComStatus = async () => {
    try {
      setCarregando(true);
      await salvar();
    } catch (erro: unknown) {
      if (erro instanceof HttpErro) {
        const data = erro.data as DadosErro;
        const detalhesMensagem = data?.detalhes || data?.message || erro.message || "";
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
    } finally {
      setCarregando(false);
    }
  };

  const reset = form.reset;

  const recuperar = useCallback(
    async (id: number) => {
      const usuario = await httpGet<Usuario>(`/usuarios/${id}`);
      if (usuario) {
        reset({
          id: usuario.id,
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
    if (usuario?.id) {
      recuperar(usuario.id);
    }
  }, [usuario, recuperar]);

  return { form, carregando, usuario, salvarComStatus };
}

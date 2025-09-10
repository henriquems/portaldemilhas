import useAPI from "./useAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { HttpErro } from "@/errors/HttpErro";
import { useState } from "react";

type NovaSenha = {
  email: string;
};

type ErroAPI = {
  message?: string;
  mensagem?: string;
};

const novaSenhaSchema = z.object({
    email: z.string().min(1, { message: "Favor informar o campo e-mail!" }),
});

export default function useNovaSenha() {
    const router = useRouter();
    const { httpPost } = useAPI();
    const [carregando, setCarregando] = useState(false);

    const form = useForm<z.infer<typeof novaSenhaSchema>>({
        resolver: zodResolver(novaSenhaSchema),
        defaultValues: {
            email: "",
        }
    })

    const gerarNovaSenha = async () => {
        setCarregando(true);
        try {
            const resposta = await httpPost<NovaSenha>('/usuarios/novaSenha', {
                email: form.getValues("email"),
            });

            toast.success(`Senha enviada para o e-mail ${resposta.email}`);
            router.push("/");
        } catch (erro: unknown) {
            if (erro instanceof HttpErro) {
                const data = erro.data as ErroAPI;
                const msg = data?.mensagem || data?.message || 'Erro desconhecido';
                toast.error(msg);
            } else {
                toast.error('Erro inesperado');
                console.error(erro);
            }
        } finally {
            setCarregando(false);
        }
    }

    return { gerarNovaSenha, carregando, form}
}


import { useCallback, useEffect, useRef, useState } from "react";
import { Paginacao, Plano } from "@portaldemilhas/core";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import useAPI from "./useAPI";

const planoSchema = z.object({
    id: z.number().optional(),
    descricao: z.string().min(1, { message: "Favor informar o campo descrição!" }),
    dias: z.coerce.number({ invalid_type_error: "Favor informar o campo dias!" }),
    valor: z.coerce.number({ invalid_type_error: "Favor informar o campo valor!" }),
});

export default function usePlano() {
    const router = useRouter()
    const params = useParams()
    const pathname = usePathname();
    const { httpGet, httpPost, httpDelete } = useAPI()
    const [ planos, setPlanos ] = useState<Plano[]>([]) 
    const [ total, setTotal ] = useState(0);
    const [ carregando, setCarregando ] = useState(true);
    const carregado = useRef(false);

    const searchParams = useSearchParams()
    const page: number = parseInt(searchParams.get('page') || "1")
    const pageSize: number = parseInt(searchParams.get('pageSize') || "10")

    const form = useForm<z.infer<typeof planoSchema>>({
        resolver: zodResolver(planoSchema),
        defaultValues: {
            descricao: "",
            dias: 0,
            valor: undefined
        }
    })

    const salvar = async () => {
        await httpPost('/planos/cadastro', {
            id: form.getValues("id"),
            descricao: form.getValues("descricao"), 
            dias: Number(form.getValues("dias")),
            valor: Number(form.getValues("valor")),
        })
        toast.success("Plano salvo com sucesso!")
        router.push("/plano")
    }
    
    const listar = useCallback(async function () {
         setCarregando(true);
        try {
            const resposta = await httpGet<Paginacao<Plano>>(`/planos?page=${page}&pageSize=${pageSize}`);
            setPlanos(resposta.itens ?? []);
            setTotal(resposta.total);
        } finally {
            setCarregando(false);
        }
    }, [httpGet, page, pageSize]);

    const excluir = async (id: number) => {
        await httpDelete(`/planos/${id}`)
        setPlanos(planos.filter((plano) => plano.id !== id))
        setTotal(total - 1);
        toast.success("Plano excluído com sucesso!")
    }

    const reset = form.reset;

    const recuperar = useCallback(async (id: number) => {
            const plano = await httpGet<Plano>(`/planos/${id}`);
            
            if (plano) {
                reset({
                    id: plano.id,
                    descricao: plano.descricao || "",
                    dias:  Number(plano.dias ?? 0),
                    valor: Number(plano.valor ?? 0),
                });
            }
        },
        [httpGet, reset]
    );
    
    useEffect(() => {
        if (params.id && !isNaN(Number(params.id)) && pathname.startsWith("/plano/cadastro")  ) {
            recuperar(Number(params.id));
        } else {
            listar();
        }
        carregado.current = true;
    }, [params.id, page, pageSize, pathname, listar, recuperar]);

    return {
        form, planos, page, pageSize, total, carregando, salvar, excluir
    }
}
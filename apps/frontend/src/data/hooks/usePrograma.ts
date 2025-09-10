import useAPI from "./useAPI";
import { useCallback, useEffect, useRef, useState } from "react";
import { Paginacao, Programa } from "@portaldemilhas/core";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const programaSchema = z.object({
    id: z.number().optional(),
    descricao: z.string().min(1, { message: "Favor informar o campo descrição!" }),
    companhia: z.string().min(1, { message: "Favor informar o campo companhia!" }),
});

export default function usePrograma() {
    const router = useRouter()
    const params = useParams()
    const pathname = usePathname();
    const { httpGet, httpPost, httpDelete } = useAPI()
    const [ programas, setProgramas ] = useState<Programa[]>([]) 
    const [ total, setTotal ] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const carregado = useRef(false);
    
    const searchParams = useSearchParams()
    const page: number = parseInt(searchParams.get('page') || "1")
    const pageSize: number = parseInt(searchParams.get('pageSize') || "10")

    const form = useForm<z.infer<typeof programaSchema>>({
        resolver: zodResolver(programaSchema),
        defaultValues: {
            descricao: "",
            companhia: "",
        }
    })

    const salvar = async () => {
        await httpPost('/programas/cadastro', {
            id: form.getValues("id"),
            descricao: form.getValues("descricao"), 
            companhia: form.getValues("companhia"), 
        })
        toast.success("Programa salvo com sucesso!")
        router.push("/programa")
    }
    
    const listar = useCallback(async function () {
        setCarregando(true);
        try {
            if (pathname === '/programa') {
                const resposta = await httpGet<Paginacao<Programa>>(`/programas?page=${page}&pageSize=${pageSize}`);
                setProgramas(resposta.itens ?? []);
                setTotal(resposta.total);
            } else {
                const resposta = await httpGet<Programa[]>('/programas/todos');
                setProgramas(resposta ?? []);
                setTotal(resposta ? resposta.length : 0); 
            }
        } finally {
            setCarregando(false);
        }
    }, [httpGet, page, pageSize, pathname]);

    const excluir = async (id: number) => {
        await httpDelete(`/programas/${id}`)
        setProgramas(programas.filter((programa) => programa.id !== id))
        setTotal(total - 1);
        toast.success("Programa excluído com sucesso!")
    }

    const reset = form.reset;

    const recuperar = useCallback(async (id: number) => {
            const programa = await httpGet<Programa>(`/programas/${id}`);
            if (programa) {
                reset({
                    id: programa.id,
                    descricao: programa.descricao || "",
                    companhia: programa.companhia || "",
                });
            }
        },
        [httpGet, reset]
    );
    
    useEffect(() => {
        listar();
        if (pathname.startsWith("/programa") && params.id && !isNaN(Number(params.id))) {
            recuperar(Number(params.id));
        }
        carregado.current = true;
    }, [params.id, page, pageSize, pathname, listar, recuperar]);

    return {
       form, programas, page, pageSize, total, carregando, salvar, excluir
    }
}
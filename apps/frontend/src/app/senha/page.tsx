'use client'
import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import Link from "next/link";
import useNovaSenha from "@/data/hooks/useNovaSenha";
import Processando from "@/components/shared/Processando";
import { Input } from "@/components/ui/input";
import { IconArrowLeft, IconLockCode } from "@tabler/icons-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Senha() {
    const { gerarNovaSenha, carregando, form } = useNovaSenha();

    return (
        <div>
            {carregando && <Processando />}

            <TituloPagina descricao="Gerar Nova Senha" icone={<IconLockCode />} />

            <Card titulo="Informe seu e-mail de cadastro">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(gerarNovaSenha)}>
                        <div className="flex flex-col gap-4 w-full lg:w-[50%]">
                            <div className="flex flex-col gap-2">
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300 mb-1">E-mail</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />    
                            </div>   
                            
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-5">
                                <button className="botao primario w-full cursor-pointer">
                                    <IconLockCode width={20} height={20} /> Enviar
                                </button>

                                <Link href="/login" className="flex items-center gap-1 
                                    text-white botao secundario">
                                    <IconArrowLeft width={20} height={20} /> Voltar
                                </Link>
                            </div>
                        </div> 
                    </form>
                </Form>
            </Card>
        </div>
    )
}
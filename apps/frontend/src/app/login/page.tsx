'use client'
import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import Link from "next/link";
import useLogin from "@/data/hooks/useLogin";
import { Input } from "@/components/ui/input";
import { IconArrowLeft, IconLockCode, IconLogin2, IconUserPlus } from "@tabler/icons-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Login() {
    const { logar, form } = useLogin()

    return (
        <div>
            <TituloPagina descricao="Área restrita" icone={<IconLogin2 />} />

            <Card titulo="Dados de acesso">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(logar)}>
                        <div className="w-full lg:w-[50%]">
                            <div className="flex flex-col gap-5">
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300 mb-1">E-mail</FormLabel>
                                            <FormControl>
                                                <Input {...field} onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                                    className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />
                                
                                <FormField 
                                    control={form.control}
                                    name="senha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-300 mb-1">Senha</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} 
                                                    className="bg-zinc-300 border-zinc-500 text-zinc-900 h-10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-8">
                                <button type="submit" className="w-full flex gap-1 botao primario">
                                    <IconLogin2 width={20} height={20} /> Acessar
                                </button>

                                <Link href="/cadastro" className="flex items-center gap-1 
                                    botao secundario w-full">
                                    <IconUserPlus width={20} height={20} />
                                    <span>Cadastro</span>
                                </Link>                    
                                
                                <Link href="/senha" className="flex items-center gap-1 
                                    botao secundario w-full">
                                    <IconLockCode width={20} height={20} />
                                    <span>Nova senha</span>
                                </Link>

                                <Link href="/" className="flex items-center gap-1 
                                    botao secundario">
                                    <IconArrowLeft width={20} height={20} />
                                    <span>Voltar</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
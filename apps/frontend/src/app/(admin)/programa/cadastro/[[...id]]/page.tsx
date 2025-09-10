'use client'
import TituloPagina from "@/components/shared/TituloPagina";
import usePrograma from "@/data/hooks/usePrograma";
import Card from "@/components/shared/Card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { IconChevronLeft, IconDeviceFloppy, IconFileText, IconUsers } from "@tabler/icons-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export default function CadastroPrograma() {
    const { salvar, form } = usePrograma();
    
    return (
        <div>
            <TituloPagina 
                descricao="Cadastro de Programa" 
                icone={<IconUsers width={20} height={20} />} 
            />

            <Card titulo="Dados do Programa"
                icon={<IconFileText width={18} height={18} />}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(salvar)}>
                        <div className="w-full lg:w-[50%] mt-2">
                            <div className="grid md:grid-cols-1 sm:grid-cols-1 w-full gap-5">
                                <div className="flex flex-col gap-1">
                                    <FormField 
                                        control={form.control}
                                        name="descricao"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Descrição</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <FormField 
                                        control={form.control}
                                        name="companhia"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Companhia</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-8">
                                <button type="submit" className="w-full botao primario">
                                    <IconDeviceFloppy width={18} height={18} />
                                    <span>Salvar</span>
                                </button>
                                <Link href="/programa" className="botao secundario">
                                    <IconChevronLeft width={18} height={18} />
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
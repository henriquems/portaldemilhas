'use client'
import TituloPagina from "@/components/shared/TituloPagina";
import Card from "@/components/shared/Card";
import Link from "next/link";
import { StatusUsuario } from "@portaldemilhas/core"
import { IconCertificate, IconChevronLeft, IconDeviceFloppy, IconFileText } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useCupom from "@/data/hooks/useCupom";
import useUsuarioInfluencer from "@/data/hooks/useUsuarioInfluencer";

export default function CadastroCupom() {
    const { salvar, form } = useCupom();
    const { usuarioInfluencers } = useUsuarioInfluencer();
    
    return (
        <div>
            <TituloPagina 
                descricao="Cadastro de Cupons" 
                icone={<IconCertificate width={20} height={20} />} 
            />

            <Card titulo="Dados do Cupom"
                icon={<IconFileText width={18} height={18} />}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(salvar)}>
                        <div className="w-full lg:w-[50%] mt-2">
                            <div className="grid md:grid-cols-2 sm:grid-cols-1 w-full gap-5">
                                <div className="flex flex-col gap-1">
                                    <FormField
                                        control={form.control}
                                        name="usuario"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Influencer</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        const usuarioSelecionado = usuarioInfluencers.find(u => u.id === Number(value));
                                                        field.onChange(usuarioSelecionado);
                                                    }}
                                                    value={field.value?.id ? field.value.id.toString() : ""}
                                                    >
                                                    <FormControl className="border-zinc-300">
                                                        <SelectTrigger className="w-full min-h-[2.5rem] 
                                                            !text-zinc-900 text-[14px] border 
                                                            bg-zinc-300 border-zinc-500">
                                                        <SelectValue placeholder="Selecione aqui..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-300 text-zinc-900 border border-zinc-500">
                                                        {usuarioInfluencers.map((usuario) => (
                                                        <SelectItem key={usuario.id} value={usuario.id?.toString() ?? ""}>
                                                            {usuario.nome}
                                                        </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                    </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full min-h-[2.5rem] 
                                                            !text-[14px] border bg-zinc-300 
                                                            !text-zinc-900 border-zinc-500">
                                                            <SelectValue placeholder="Selecione aqui..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-300 text-zinc-900 border border-zinc-500">
                                                        {Object.entries(StatusUsuario).map(([key, status]) => (
                                                            <SelectItem key={key} value={key}>
                                                            {status.descricao}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
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
                                        name="valorDesconto"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="mb-1">Valor Desconto %</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10"
                                                />
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
                                <Link href="/cupom" className="botao secundario">
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
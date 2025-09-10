'use client'
import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import useAnuncio from "@/data/hooks/useAnuncio";
import CardPrograma from "@/components/shared/CardPrograma";
import usePendente from "@/data/hooks/usePendente";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowLeft, IconDeviceFloppy, IconTagStarred } from "@tabler/icons-react";
import { NumericFormat } from 'react-number-format';
import { useEffect } from "react";
import { StatusAnuncio, StatusAnuncioTipo, TipoAnuncio } from "@portaldemilhas/core";
import { useRouter } from "next/navigation";
import Processando from "@/components/shared/Processando";

export default function CadastrarAnuncio() {
    const { form, programas, params, carregando, salvarComStatus } = useAnuncio();
    const { contemAssinatura, assinaturaPaga } = usePendente();
    const router = useRouter();
    const id = params?.id;

    useEffect(() => {
        if (contemAssinatura !== undefined && (!contemAssinatura || !assinaturaPaga)) {
            router.push("/pendente");
        }
    }, [contemAssinatura, assinaturaPaga, router]);

    const carregandoInicial = carregando || contemAssinatura === undefined || assinaturaPaga === undefined;

    if (carregandoInicial) return <Processando />;

    if (!contemAssinatura || !assinaturaPaga) return null;
    
    return (
        <div> 
            { carregando && <Processando />}
            
            <TituloPagina descricao="Anunciar" icone={<IconTagStarred />} />
            
            <Card titulo="Dados do anuncio">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(salvarComStatus)}>
                        <div className="flex flex-col gap-4 w-full lg:w-[50%]">
                            <FormField
                                control={form.control}
                                name="programa"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-slate-300 mb-1">Selecione o programa</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-3 w-full gap-3">
                                        {programas.map(programa => (
                                            <CardPrograma
                                                key={programa.id}
                                                programa={programa}
                                                selecionado={field.value?.id === programa.id}
                                                onSelecionar={() => field.onChange(programa)}
                                            />
                                        ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            { id && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-slate-300 mb-1">Status do anuncio </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="w-full min-h-[2.5rem] 
                                                        !text-zinc-900 text-[16px] lg:text-[14px] border 
                                                        bg-zinc-300 border-zinc-500">
                                                    <SelectValue placeholder="Filtrar por status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-300 text-zinc-900 border border-zinc-500">
                                                    <SelectItem value="TODOS" className="text-zinc-900">Todos os status</SelectItem>
                                                        {(Object.keys(StatusAnuncio) as StatusAnuncioTipo[]).map((status) => (
                                                        <SelectItem
                                                            key={status}
                                                            value={status}
                                                            className="hover:bg-blue-700 focus:bg-blue-700 text-zinc-900"
                                                        >
                                                            {StatusAnuncio[status].descricao}
                                                        </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-slate-300 mb-1">Tipo anuncio</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full min-h-[2.5rem] 
                                                    !text-zinc-900 border 
                                                    border-zinc-500 bg-zinc-300">
                                                    <SelectValue placeholder="Selecione aqui..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-300 text-zinc-900 border border-zinc-500">
                                                {Object.entries(TipoAnuncio).map(([key, tipo]) => (
                                                    <SelectItem key={key} value={key} 
                                                        className="text-zinc-900 hover:bg-blue-700 focus:bg-blue-700">
                                                    {tipo.descricao}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 lg-mt-0">
                                <FormField
                                    control={form.control}
                                    name="quantidadeMilhas"
                                    render={({ field: { onChange, value, ref, ...rest } }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-slate-300 mb-1">Quantidade de Milhas</FormLabel>
                                            <FormControl>
                                                <NumericFormat
                                                    { ...rest }
                                                    value={value ?? ''}
                                                    getInputRef={ref}
                                                    onValueChange={(values) => {
                                                        onChange(values.floatValue);
                                                    }}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    allowNegative={false}
                                                    allowLeadingZeros={false}
                                                    decimalScale={0}
                                                    className="bg-zinc-300 text-zinc-900 h-10 border border-zinc-500 px-2 rounded-md w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="valor"
                                    render={({ field: { onChange, value, ref, ...rest } }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-slate-300 mb-1">Valor</FormLabel>
                                            <FormControl>
                                                <NumericFormat
                                                    {...rest}
                                                    value={value ?? ''}
                                                    getInputRef={ref}
                                                    onValueChange={(values) => {
                                                        onChange(values.floatValue);
                                                    }}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="R$ "
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    allowNegative={false}
                                                    className="bg-zinc-300 text-zinc-900 h-10 border border-zinc-500 px-2 rounded-md w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-8 w-full lg:w-[50%]">
                            <button type="submit" className="botao primario w-full">
                                <IconDeviceFloppy />
                                <span>Salvar</span>
                            </button>

                            <button onClick={() => router.back()} className="botao secundario">
                                <IconArrowLeft />
                                <span>Voltar</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
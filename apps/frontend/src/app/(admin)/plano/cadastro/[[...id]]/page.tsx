'use client'
import TituloPagina from "@/components/shared/TituloPagina";
import Card from "@/components/shared/Card";
import usePlano from "@/data/hooks/usePlano";
import Link from "next/link";
import { IconChevronLeft, IconDeviceFloppy, IconFileText, IconUsers } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { NumericFormat } from "react-number-format";

export default function CadastroPlano() {
    const { salvar, form } = usePlano();

    return (
        <div>
            <TituloPagina
                descricao="Cadastro de Plano" 
                icone={<IconUsers width={20} height={20} />} 
            />

            <Card titulo="Dados do Plano"
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
                                        name="dias"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Dias</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <FormField 
                                        control={form.control}
                                        name="valor"
                                        render={({ field: { onChange, value, ref, ...rest } }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1">Valor</FormLabel>
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
                                                        className="bg-zinc-300 border border-zinc-500 text-zinc-900 h-10 px-2 rounded-md w-full"
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
                                <Link href="/plano" className="botao secundario">
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
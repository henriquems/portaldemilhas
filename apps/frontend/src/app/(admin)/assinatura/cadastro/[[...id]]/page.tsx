'use client'
import TituloPagina from "@/components/shared/TituloPagina";
import useAssinatura from "@/data/hooks/useAssinatura";
import Card from "@/components/shared/Card";
import CardPlano from "@/components/shared/CardPlano";
import Link from "next/link";
import Processando from "@/components/shared/Processando";
import { IconCashRegister, IconCertificate, IconChevronLeft } from "@tabler/icons-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export default function CadastroAssinatura() {
    const { form, planos, processando, salvar } = useAssinatura();

    if (processando || planos.length === 0) {
        return <Processando />;
    }

    return (
        <div>
            <TituloPagina 
                descricao="Cadastro de Assinatura" 
                icone={<IconCertificate />} 
            />

            <Card titulo="Dados da Assintura">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(salvar)}>
                        <div className="w-full lg:w-[50%] mt-2">
                            <div className="w-full gap-5">
                                <div className="flex flex-col gap-1">
                                    <FormField
                                        control={form.control}
                                        name="plano"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-300 mb-1">Selecione o plano</FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-1 w-full gap-2">
                                                    {planos.map(plano => (
                                                        <CardPlano
                                                            key={plano.id}
                                                            plano={plano}
                                                            selecionado={field.value?.id === plano.id}
                                                            onSelecionar={() => field.onChange(plano)}
                                                        />
                                                    ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-8">
                                <button type="submit" className="w-full botao primario">
                                    <IconCashRegister />
                                    <span className="text-sm">Continuar</span>
                                </button>
                                <Link href="/assinatura" className="botao secundario">
                                    <IconChevronLeft />
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
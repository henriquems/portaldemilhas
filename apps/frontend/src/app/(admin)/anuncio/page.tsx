'use client'
import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import useAnuncio from "@/data/hooks/useAnuncio";
import usePendente from "@/data/hooks/usePendente";
import { formatCurrencyBRL } from "@portaldemilhas/core";
import { IconBrandWhatsapp, IconCashRegister, IconSearch, IconShoppingCart, IconShoppingCartDollar } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Processando from "@/components/shared/Processando";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function ListarAnuncio() {
    const { 
        anuncios, programas, programaSelecionado, carregando, 
        setProgramaSelecionado, tipoSelecionado, setTipoSelecionado,
        setQuantidadeMinima, inputLocal, setInputLocal
    } = useAnuncio();
    const { contemAssinatura, assinaturaPaga } = usePendente();
    const router = useRouter();

    useEffect(() => {
        if (contemAssinatura !== undefined && (!contemAssinatura || !assinaturaPaga)) {
            router.push("/pendente");
        }
    }, [contemAssinatura, assinaturaPaga, router]);
    
    if (carregando) return <Processando />

    if (!contemAssinatura || !assinaturaPaga) return null;

    return (
        <div>
            <TituloPagina descricao="Anuncios" icone={<IconShoppingCartDollar />} />

            <div className="flex flex-col gap-3">
                <Card icon={<IconSearch />} titulo="Filtros para pesquisa">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full mb-2">
                        <Select 
                            onValueChange={(value) => {
                                setTipoSelecionado(value === "todos" ? null : value);
                            }}
                            value={tipoSelecionado ?? ""}
                        >
                            <SelectTrigger className="w-full min-h-[2.5rem] 
                                !text-zinc-900 text-[16px] lg:text-[14px] border
                                bg-zinc-300 border-zinc-500">
                                <SelectValue placeholder="Selecione o tipo de anúncio" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-300 border border-zinc-500 text-zinc-900">
                                <SelectItem value="todos" className="text-zinc-900 focus:bg-blue-700">Todos os Tipos</SelectItem>
                                <SelectItem value="VENDA" className="text-zinc-900 focus:bg-blue-700">Venda</SelectItem>
                                <SelectItem value="COMPRA" className="text-zinc-900 focus:bg-blue-700">Compra</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select 
                            onValueChange={(value) => {
                                if (value === "todos") {
                                    setProgramaSelecionado(null);
                                } else {
                                    const id = Number(value);
                                    setProgramaSelecionado(isNaN(id) ? null : id);
                                }
                            }}
                            value={programaSelecionado?.toString() ?? ""}
                        >
                            <SelectTrigger className="w-full min-h-[2.5rem] 
                                !text-zinc-900 text-[16px] lg:text-[14px] border
                                bg-zinc-300 border-zinc-500">
                                <SelectValue placeholder="Selecione o programa" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-300 border border-zinc-500 text-zinc-900">
                                <SelectItem value="todos" className="text-zinc-900 focus:bg-blue-700">Todos os Programas</SelectItem>
                                {programas.map((programa) => (
                                    <SelectItem key={programa.id}
                                        value={(programa?.id ?? "").toString()}
                                        className="text-zinc-900 focus:bg-blue-700"
                                    >
                                        {programa.descricao}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            min={0}
                            placeholder="Quantidade mínima de milhas"
                            value={inputLocal}
                            onChange={(e) => setInputLocal(e.target.value)}
                            onBlur={() =>
                                setQuantidadeMinima(inputLocal ? parseInt(inputLocal) : null)
                            }
                            className="h-10 w-full bg-zinc-300 border border-zinc-500 text-zinc-900 placeholder:text-zinc-900"
                        />
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    { anuncios.map((anuncio) => (
                        <Card icon={anuncio.tipo == 'VENDA' ? <IconCashRegister /> : <IconShoppingCart />}
                            titulo={anuncio.tipo} 
                            key={anuncio.id}
                            classe="hover:bg-zinc-900">
                                
                            <div className="flex flex-col text-white gap-3">
                                <div>
                                    <label className="text-white">{ anuncio.usuario.nome }</label>
                                </div>
                                
                                <div className="flex items-center justify-between text-white">
                                    <label className="font-bold">{ anuncio.programa.descricao }</label>
                                    <label>{ anuncio.programa.companhia }</label>
                                </div>

                                <div className="flex items-center justify-between text-white">
                                    <label>{ anuncio.quantidadeMilhas.toLocaleString('pt-BR') } Milhas</label>
                                    <label className="font-bold">{ formatCurrencyBRL(anuncio.valor) }</label>
                                </div>
                                
                                <div className="mt-2">
                                    <Link href={`https://Wa.me/55${anuncio.usuario.telefone}?text=Olá,%20vi%20seu%20anuncio%20no%20Portal%20de%20Milhas!`} 
                                        target="_blank" className="botao destaque">
                                        <IconBrandWhatsapp /> Whatsapp
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
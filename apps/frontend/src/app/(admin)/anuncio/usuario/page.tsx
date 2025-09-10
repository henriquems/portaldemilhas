'use client'
import Link from "next/link";
import Card from "@/components/shared/Card";
import Deleta from "@/components/shared/Deleta";
import Status from "@/components/shared/Status";
import TituloPagina from "@/components/shared/TituloPagina";
import useAnuncio from "@/data/hooks/useAnuncio";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrencyBRL, formatDateTimeBR, StatusAnuncio, StatusAnuncioTipo } from "@portaldemilhas/core";
import { IconCashRegister, IconEdit, IconFileCertificate, IconReportSearch, IconSearch, IconShoppingCart, IconTrash, IconX } from "@tabler/icons-react";
import Processando from "@/components/shared/Processando";

export default function MeusAnuncios() {
    const { anuncios, programas, programaSelecionado, carregando, usuario, setProgramaSelecionado, excluir } = useAnuncio();

    if (carregando) return <Processando />

    return (
         <div>
            <TituloPagina 
                descricao="Meus Anuncios" 
                icone={<IconFileCertificate />} 
                labelBotao="Novo"
                urlBotao="/anuncio/cadastro"     
            />

            <div className="flex flex-col gap-3">
                { anuncios && anuncios.length > 0 ? (
                    <>
                        <Card icon={<IconSearch />} titulo="Filtros para pesquisa">
                            <div className="w-full lg:w-[25%] mb-2">
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
                                        border-zinc-500 bg-zinc-300">
                                        <SelectValue placeholder="Selecione o programa" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-300 text-zinc-900 border border-zinc-500">
                                        <SelectItem value="todos" className="text-zinc-900">Todos os Programas</SelectItem>
                                        {programas.map((programa) => (
                                            <SelectItem
                                                key={programa.id}
                                                value={(programa?.id ?? "").toString()}
                                                className="hover:bg-blue-700 focus:bg-blue-700 text-zinc-900"
                                            >
                                                {programa.descricao}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {anuncios.map((anuncio) => {
                                const status = anuncio.status as StatusAnuncioTipo;
                                const props = StatusAnuncio[status];
                                const podeGerenciar = anuncio.usuario.id === usuario?.id;

                                return (
                                    <Card icon={anuncio.tipo == 'VENDA' ? <IconCashRegister /> : <IconShoppingCart />}
                                        titulo={anuncio.tipo}
                                        key={anuncio.id}
                                        classe="hover:bg-zinc-900">
                                    
                                        <div className="flex flex-col gap-3 text-white">
                                            <div className="flex items-center justify-between">
                                                <label className="font-bold">{anuncio.programa.companhia}</label>
                                                <div>
                                                    <Status valor={status} cor={props.cor} descricao={props.descricao} largura="70" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <label>{anuncio.quantidadeMilhas.toLocaleString("pt-BR")} Milhas</label>
                                                <label className="font-bold">{formatCurrencyBRL(anuncio.valor)}</label>
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button className="botao destaque w-full" title="Detalhes">
                                                            <IconReportSearch /> Detalhes
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent showCloseButton={false} 
                                                        className="max-w-[95%] lg:max-w-[500px]
                                                        bg-zinc-800 border border-zinc-800 p-2 lg:p-4">
                                                        <DialogClose asChild>
                                                            <button className="absolute right-6 top-2 lg:top-4 text-white cursor-pointer">
                                                                <IconX width={22} height={22} stroke={3} title="Fechar" />
                                                            </button>
                                                        </DialogClose>
                                                        <DialogHeader>
                                                            <DialogTitle className="text-white font-bold">Detalhes do Anuncio</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="text-white p-2 mb-2">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Tipo: </label>
                                                                        <span>{anuncio.tipo}</span>
                                                                    </div>
                                                                    
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Programa: </label>
                                                                        <span>{anuncio.programa.descricao}</span>
                                                                    </div>
                                    
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Companhia: </label>
                                                                        <span>{anuncio.programa.companhia}</span>
                                                                    </div>
                                    
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Quantidade: </label>
                                                                        <span>{anuncio.quantidadeMilhas}</span>
                                                                    </div>
                                    
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Valor: </label>
                                                                        <span className="font-bold">{anuncio.valor ? formatCurrencyBRL(anuncio.valor) : 'Não informado'}</span>
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Status: </label>
                                                                        <span>{anuncio.status}</span>
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Data: </label>
                                                                        <span>{formatDateTimeBR(anuncio.data)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Link href={podeGerenciar ? `/anuncio/cadastro/${anuncio.id}` : '#'} 
                                                    className={`botao primario w-full ${!podeGerenciar ? 'pointer-events-none opacity-50' : ''}`}>
                                                    <IconEdit /> Editar
                                                </Link>

                                                <Deleta id={anuncio.id!} excluir={excluir} descricao="anuncio">
                                                      <button
                                                            className={`botao secundario w-full ${!podeGerenciar ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            disabled={!podeGerenciar} title="Excluir"
                                                        >
                                                        <IconTrash /> Excluir
                                                    </button>
                                                </Deleta>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <Card titulo="Anuncio não encontrado">
                        <div className="flex flex-col gap-1 mt-2 mb-2">
                            <div className="flex gap-1">
                                <span className="text-orange-500 text-lg font-semibold">Você ainda não possui um anuncio cadastrado!</span>    
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-300">Você já pode cadastrar um anuncio de compra ou venda de milhas em nosso site.</span>
                                <Link href="/anuncio/cadastro" className="link mt-5">Clique aqui para cadastrar um anuncio!</Link>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

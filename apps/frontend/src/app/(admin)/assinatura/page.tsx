'use client'
import TituloPagina from "@/components/shared/TituloPagina";
import useAssinatura from "@/data/hooks/useAssinatura";
import Link from "next/link";
import Deleta from "@/components/shared/Deleta";
import Processando from "@/components/shared/Processando";
import Card from "@/components/shared/Card";
import Status from "@/components/shared/Status";
import { IconBrandCashapp, IconCertificate, IconEdit, IconProgressX, IconReportSearch, IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Assinatura, formatCurrencyBRL, formatDateTimeBR, StatusAssinatura, StatusAssinaturaTipo } from "@portaldemilhas/core";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PesquisaAssinatura() {
    const { planos, assinaturas, total, carregando, planoSelecionado, setPlanoSelecionado, usuario, excluir, pagar } = useAssinatura();
    const [ habilitaBotao, setHabilitaBotao ] = useState<boolean>(false);
    
    useEffect(() => {
        if (!assinaturas || assinaturas.length === 0) {
            setHabilitaBotao(true);
        } else if (assinaturas.length > 0) {
            const ultimaAssinatura: Assinatura = assinaturas[assinaturas.length - 1]
            
            if(assinaturas && ultimaAssinatura.status === 'VENCIDA') {
                setHabilitaBotao(true);
            } else {
                setHabilitaBotao(false);
            }
        }
    }, [assinaturas])

    if (carregando) return <Processando />

    return (
        <div>
            <TituloPagina 
                icone={<IconCertificate />} 
                descricao="Assinaturas"
                quantidadeRegistros={total}
                labelBotao={habilitaBotao ? 'Nova' : undefined}
                urlBotao="/assinatura/cadastro"
            />
            
            <div className="flex flex-col gap-3">
                { assinaturas && assinaturas.length > 0 ? (
                    <>
                        <Card icon={<IconSearch />} titulo="Filtros para pesquisa">
                            <div className="w-full lg:w-[25%] mb-2">
                                <Select 
                                    onValueChange={(value) => {
                                        if (value === "todos") {
                                            setPlanoSelecionado(null);
                                        } else {
                                            const id = Number(value);
                                            setPlanoSelecionado(isNaN(id) ? null : id);
                                        }
                                    }}
                                    value={planoSelecionado?.toString() ?? ""}
                                >
                                    <SelectTrigger className="h-10 w-full min-h-[2.5rem] 
                                        !text-zinc-900 text-[16px] lg:text-[14px] border 
                                        border-zinc-500 bg-zinc-300">
                                        <SelectValue placeholder="Selecione o plano" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-300 text-zinc-900 border border-zinc-500">
                                        <SelectItem value="todos" className="text-zinc-900">Todos os planos</SelectItem>
                                        {planos.map((plano) => (
                                            <SelectItem
                                                key={plano.id}
                                                value={(plano?.id ?? "").toString()}
                                                className="hover:bg-blue-700 focus:bg-blue-700 text-zinc-900"
                                            >
                                                {plano.descricao}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {assinaturas.map((assinatura) => {
                                const status = assinatura.status as StatusAssinaturaTipo;
                                const props = StatusAssinatura[status];
                                const podeGerenciar = assinatura.usuario.id === usuario?.id;

                                return (
                                    <Card
                                        icon={<IconCertificate />}
                                        titulo={assinatura.usuario.nome}
                                        key={assinatura.id}
                                        classe="hover:bg-zinc-900">
                                    
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <label className="font-bold">Assinatura {assinatura.plano.descricao}</label>
                                                <div className="text-sm">
                                                    <Status valor={status} cor={props.cor} descricao={props.descricao} largura="100" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <label className="text-sm">{formatDateTimeBR(assinatura.data)}</label>
                                                <label className="text-sm font-bold">{formatCurrencyBRL(assinatura.valor)}</label>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-2">
                                                { assinatura.status !== 'PAGA' && assinatura.status !== 'VENCIDA' ? 
                                                    <button
                                                        onClick={() => {
                                                            if (podeGerenciar && assinatura.id != null) pagar(assinatura.id);
                                                        }}
                                                        title="Pagar"
                                                        className={`botao primario w-full ${!podeGerenciar ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={!podeGerenciar}
                                                    >
                                                        <IconBrandCashapp /> { assinatura.status }
                                                    </button>
                                                    : 
                                                    <button className="botao secundario w-full cursor-auto text-zinc-500 
                                                        hover:bg-zinc-600 hover:border-zinc-600">
                                                        <IconProgressX /> { assinatura.status }
                                                    </button>
                                                }

                                                { assinatura.status !== 'PAGA' && assinatura.status !== 'VENCIDA' ?
                                                    <Link
                                                        href={podeGerenciar ? `/assinatura/cadastro/${assinatura.id}` : '#'}
                                                        className={`botao secundario w-full ${!podeGerenciar ? 'pointer-events-none opacity-40' : ''}`}
                                                    >
                                                        <IconEdit title="Editar" /> Editar
                                                    </Link>
                                                    : 
                                                    <button className="botao secundario w-full cursor-auto text-zinc-500 
                                                        hover:bg-zinc-600 hover:border-zinc-600">
                                                        <IconProgressX  /> { assinatura.status }
                                                    </button>
                                                }
                                            
                                                { assinatura.status !== 'PAGA' && assinatura.status !== 'VENCIDA' ?
                                                    <Deleta id={assinatura.id!}
                                                        descricao={assinatura.plano.descricao}
                                                        excluir={excluir}
                                                    >
                                                        <button
                                                            className={`botao secundario w-full ${!podeGerenciar ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            disabled={!podeGerenciar}
                                                        >
                                                            <IconTrash /> Excluir
                                                        </button>
                                                    </Deleta>
                                                    : 
                                                    <button className="botao secundario w-full cursor-auto text-zinc-500 
                                                        hover:bg-zinc-600 hover:border-zinc-600">
                                                        <IconProgressX /> { assinatura.status }
                                                    </button>
                                                }
                                                
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <button className="botao secundario w-full">
                                                            <IconReportSearch /> Detalhes
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent showCloseButton={false} className="max-w-[95%] lg:max-w-[550px]
                                                         bg-zinc-800 border border-zinc-800 p-2 lg:p-4">
                                                        <DialogClose asChild>
                                                            <button className="absolute right-6 top-2 lg:top-4 text-white cursor-pointer">
                                                                <IconX width={22} height={22} stroke={3} title="Fechar" />
                                                            </button>
                                                        </DialogClose>
                                                        <DialogHeader>
                                                            <DialogTitle className="text-white font-bold">Detalhes da Assinatura</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="text-white rounded-lg p-2 lg:p-4 mb-2">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="grid grid-cols-2 gap-5">
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Usuário: </label>
                                                                        <span>{assinatura.usuario.nome}</span>
                                                                    </div>
                                                                    
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Plano: </label>
                                                                        <span>{assinatura.plano.descricao}</span>
                                                                    </div>
                                    
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Status: </label>
                                                                        <span>{assinatura.status}</span>
                                                                    </div>
                                    
                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Valor: </label>
                                                                        <span>{formatCurrencyBRL(assinatura.valor)}</span>
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Valor Pago: </label>
                                                                        <span>{assinatura.valorPago ? formatCurrencyBRL(assinatura.valorPago) : 'AGUARDANDO'}</span>
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Data Pagamento: </label>
                                                                        <span>{assinatura.dataPagamento ? formatDateTimeBR(assinatura.dataPagamento) : 'AGUARDANDO'}</span>
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Data Vencimento: </label>
                                                                        <span>{assinatura.dataVencimento ? formatDateTimeBR(assinatura.dataVencimento) : 'AGUARDANDO'}</span>
                                                                    </div>

                                                                    <div className="flex flex-col">
                                                                        <label className="text-zinc-400">Data Cadastro: </label>
                                                                        <span>{formatDateTimeBR(assinatura.data)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <Card titulo="Assinatura não encontrada">
                        <div className="flex flex-col gap-1 mt-2 mb-2">
                            <div className="flex gap-1">
                                <span className="text-orange-500 text-lg font-semibold">Você ainda não possui um plano de assinatura!</span>    
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <span className="text-white">Para tera acesso exclusivo e negociar milhas em nosso site, você deve escolher um plano de assinatura.</span>
                                <Link href="/assinatura/cadastro" className="font-semibold mt-5 hover:underline">Clique aqui para escolher um plano!</Link>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
'use client'
import { IconAlertHexagon, IconCertificate, IconChevronLeft, IconPencilStar } from "@tabler/icons-react";
import Card from "@/components/shared/Card";
import TituloPagina from "@/components/shared/TituloPagina";
import Link from "next/link";
import usePendente from "@/data/hooks/usePendente";
import Processando from "@/components/shared/Processando";

export default function Pendente() {
    const { usuario, contemAssinatura } = usePendente();
    const carregando = contemAssinatura === undefined;

    return (
        <div className="w-full flex justify-center px-4">
            <div className="w-full lg:w-[50%]">
                <TituloPagina descricao="Assinatura Pendente" icone={<IconAlertHexagon width={20} height={20} />} />

                <Card titulo="Área exclusiva para assinantes">
                    <div className="flex flex-col gap-2">

                        <div className="flex flex-col gap-2 text-white">
                            <span className="font-semibold">Olá {usuario?.nome}!</span>
                            <span>Você está tentando acessar um conteúdo exclusivo.</span>
                        </div>

                        {carregando ? (
                            <Processando />
                        ) : !contemAssinatura ? (
                            <div className="flex flex-col gap-2">
                                <span className="text-orange-500 text-[16px]">Identificamos que você ainda não tem uma assinatura.</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <span className="text-orange-500 text-[16px]">Identificamos que a sua assinatura está aguardando pagamento ou vencida.</span>
                            </div>
                        )}

                        {!carregando && (
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-5">
                                <Link
                                    href={`${contemAssinatura ? '/assinatura' : '/assinatura/cadastro'}`}
                                    className="botao primario w-full"
                                >
                                    {contemAssinatura ? (
                                        <div className="flex gap-1">
                                            <IconCertificate />
                                            <span>Regularizar</span>
                                        </div>
                                    ) : (
                                        <div className="flex gap-1">
                                            <IconPencilStar />
                                            <span>Assinar</span>
                                        </div>
                                    )}
                                </Link>

                                <Link href="/" className="botao secundario">
                                    <IconChevronLeft />
                                    <span>Voltar</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

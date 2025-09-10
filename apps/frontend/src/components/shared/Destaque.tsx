'use client'
import { useEffect, useRef, useState } from "react";
import {
  IconBrandWhatsapp,
  IconCashRegister,
  IconCertificate,
  IconCirclePlus,
  IconFileCertificate,
  IconLogin2,
  IconShoppingCart,
  IconX
} from "@tabler/icons-react";
import { formatCurrencyBRL } from "@portaldemilhas/core";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import useAnuncio from "@/data/hooks/useAnuncio";
import usePendente from "@/data/hooks/usePendente";
import Card from "./Card";
import Link from "next/link";
import Processando from "./Processando";

export default function Destaque() {
  const { anuncios, carregando } = useAnuncio();
  const { usuario, contemAssinatura, assinaturaPaga } = usePendente();
  const [dialogAberto, setDialogAberto] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const positionRef = useRef(0);

  useEffect(() => {
    if (dialogAberto || !wrapperRef.current || anuncios.length === 0) return;

    const wrapper = wrapperRef.current;
    const speed = 1.0;
    const totalWidth = wrapper.scrollWidth / 2; 

    const animate = () => {
      positionRef.current -= speed;

      if (Math.abs(positionRef.current) >= totalWidth) {
        positionRef.current = 0;
      }

      wrapper.style.transform = `translateX(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [dialogAberto, anuncios]);

  if (carregando) return <Processando />;

  const renderCards = () =>
    anuncios
      .filter(anuncio =>
        anuncio?.programa &&
        anuncio?.usuario &&
        typeof anuncio?.valor === "number" &&
        typeof anuncio?.quantidadeMilhas === "number"
      )
      .map((anuncio, index) => (
        <div key={`${anuncio.id}-${index}`} className="min-w-[300px] shrink-0">
          <Card
            icon={anuncio.tipo === 'VENDA' ? <IconCashRegister /> : <IconShoppingCart />}
            titulo={anuncio.tipo}
            classe="hover:bg-zinc-900"
          >
            <div className="flex flex-col gap-3 p-1">
              <div className="flex items-center justify-between text-white">
                <label className="font-bold">{anuncio.programa.descricao}</label>
                <label>{anuncio.programa.companhia}</label>
              </div>
              <div className="flex items-center justify-between text-white">
                <label>
                  {anuncio.quantidadeMilhas.toLocaleString("pt-BR")} Milhas
                </label>
                <label>{formatCurrencyBRL(anuncio.valor)}</label>
              </div>

              {assinaturaPaga ? (
                <Link
                  href={`https://Wa.me/55${anuncio.usuario.telefone}?text=Olá,%20vi%20seu%20anuncio%20no%20Portal%20de%20Milhas!`}
                  target="_blank"
                  className="botao destaque flex items-center gap-1"
                >
                  <IconBrandWhatsapp /> Whatsapp
                </Link>
              ) : (
                <Dialog onOpenChange={setDialogAberto}>
                  <DialogTrigger asChild>
                    <button className="botao destaque flex items-center gap-1 mt-1">
                      <IconBrandWhatsapp /> Whatsapp
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    showCloseButton={false}
                    className="max-w-[98%] lg:max-w-[500px] bg-gray-800 border border-slate-900 p-2 lg:p-4"
                  >
                    <DialogClose asChild>
                      <button className="absolute right-6 top-2 lg:top-4 text-slate-400 cursor-pointer">
                        <IconX width={22} height={22} stroke={3} title="Fechar" />
                      </button>
                    </DialogClose>
                    <DialogHeader>
                      <DialogTitle className="font-bold">
                        Detalhes do Anúncio
                      </DialogTitle>
                    </DialogHeader>
                    <div className="bg-slate-950 rounded-lg p-4 mb-2">
                      <div className="flex flex-col gap-2">
                        <div className="font-semibold">Área exclusiva para assinantes</div>
                        <div className="flex flex-col gap-1 mt-2 mb-2">
                          <span className="text-zinc-300">
                            Você está tentando acessar um conteúdo exclusivo.
                          </span>
                          {!usuario ? (
                            <div className="flex flex-col gap-5">
                              <p className="text-orange-300">
                                Para acessar o anúncio, você deve efetuar o login!
                              </p>
                              <Link href="/login" className="flex gap-1 botao primario">
                                <IconLogin2 size={20} /> Efetuar Login
                              </Link>
                            </div>
                          ) : !contemAssinatura ? (
                            <div className="flex flex-col gap-5">
                              <p className="text-orange-300 text-[16px]">
                                Identificamos que você ainda não possui uma assinatura!
                              </p>
                              <Link href="/assinatura/cadastro"
                                className="flex gap-1 botao primario"
                              >
                                <IconCirclePlus /> Assinar
                              </Link>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-5">
                              <p className="text-orange-300 text-[16px]">
                                Identificamos que você precisa regularizar a sua assinatura!
                              </p>
                              <Link href="/assinatura" className="flex gap-1 botao primario">
                                <IconCertificate /> Pagar
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </Card>
        </div>
      ));

  return (
    <div className="w-full mx-auto overflow-hidden">
      <div className="flex items-center gap-1 mb-5">
        <IconFileCertificate />
        <span className="font-semibold">Anuncios em destaque</span>
      </div>
      <div
        ref={wrapperRef}
        className="flex gap-4"
        style={{ display: 'flex', flexWrap: 'nowrap', transform: 'translateX(0)' }}
      >
        {renderCards()}
        {renderCards() /* duplicamos a lista no JSX */}
      </div>
    </div>
  );
}

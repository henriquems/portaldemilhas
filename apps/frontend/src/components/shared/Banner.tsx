import { IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
    return (
        <div className="flex items-center justify-center relative 
            h-[180px] lg:h-[225px] w-full mt-17 mb-8 overflow-hidden">
            <Image
                src="/fundo-banner.png"
                alt="Avião"
                fill
                className="absolute inset-0 w-full h-full object-cover opacity-60 lg:opacity-50"
            />

            <div className="relative z-10 flex flex-col items-center justify-center 
                text-center gap-3 px-4 h-full">
                <p className="text-xl lg:text-3xl font-bold text-zinc-200">
                    Compra e venda de milhas aéreas
                </p>

                <p className="text-[16px] lg:text-xl font-semibold text-zinc-300 max-w-xl">
                    As melhores ofertas para negociar suas milhas entre diferentes companhias aéreas
                </p>

                <div className="mt-2">
                    <Link href="/anuncio" className="botao destaque">
                        <IconSearch /> Ver anúncios
                    </Link>
                </div>
            </div>
        </div>
    );
}

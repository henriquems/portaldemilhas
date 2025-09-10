"use client";

import Image from "next/image";

export default function Processando() {
    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Image src="/loading.gif" alt="Carregando" 
                    width={100} height={100} unoptimized />
            </div>
        </div>
    );
}
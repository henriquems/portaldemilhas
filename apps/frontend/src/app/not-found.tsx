'use client'
import { useRouter } from "next/navigation";

export default function PaginaNaoEncontrada() {
    const router = useRouter()

    return (
        <main className="flex flex-col gap-8 flex-1 items-center justify-center">
            <div className="flex items-center justify-center gap-3">
                <span className="text-6xl text-slate-500 font-bold">404</span>
                <span className="text-lg text-slate-400 font-semibold">Página não encontrada!</span>
            </div>
            <button
                onClick={() => router.back()}
                className="botao secundario"
            >
                Voltar para a página anterior
            </button>
        </main>
    );
}
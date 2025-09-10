'use client'
import Logo from "../shared/Logo";
import Menu from "../shared/Menu";

export default function Cabecalho() {
    return (
        <header className="flex justify-center fixed top-0 
            left-0 w-full bg-[#0D1117] shadow-lg h-18 z-40 
            border-b border-zinc-950">
            <div className="flex items-center justify-between container
                text-slate-400 text-lg">
                <Logo largura={40} altura={40} />
                
                <div>
                    <Menu />
                </div>
            </div>
        </header>
    )
}
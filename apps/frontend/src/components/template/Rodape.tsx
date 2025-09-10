import Link from "next/link";

export default function RodapeInterno() {
  return (
    <footer className="flex flex-col items-center justify-center 
      gap-2 p-4 bg-[#0D1117] border-t border-zinc-950 
      w-full text-center">
      
      <div className="flex items-center gap-2 justify-center text-[14px] text-slate-400">
        <Link href="/termo" className="hover:underline">Termo de Uso</Link>
        <span className="text-xs"> | </span>
        <Link href="/politica" className="hover:underline">Política de Privacidade</Link>
      </div>

      <div className="flex flex-col lg:flex-row text-[14px] text-slate-400">
        <span>www.portaldemilhas.com.br</span>
        <span className="hidden sm:inline ml-1 mr-1"> - </span>
        <span> contato@portaldemilhas.com.br</span>
      </div>
    </footer>
  );
}

'use client'
import { ReactNode } from 'react'
import { usePathname } from "next/navigation";
import Cabecalho from './Cabecalho'
import Rodape from './Rodape'
import Banner from '../shared/Banner';

export interface PaginaProps {
    children: ReactNode
}

export default function Pagina(props: PaginaProps) {
    const pathname = usePathname();
    const margemTopo = pathname !== "/" ? "mt-24" : "";
    
    return (
        <div className={`flex flex-col min-h-screen ${margemTopo}`}>
            <Cabecalho />
            {pathname === "/" && <Banner />}
            <main className='flex flex-1 flex-col mb-10 container'>
                {props.children}
            </main>
            <Rodape />
        </div>
    )
}
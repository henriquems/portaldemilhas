'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Processando from "@/components/shared/Processando";

interface ProcessandoContextProps {
    exibir: () => void;
    ocultar: () => void;
    visivel: boolean;
}

const ProcessandoContext = createContext<ProcessandoContextProps>({
    exibir: () => {},
    ocultar: () => {},
    visivel: false
});

export const ProcessandoProvider = ({ children }: { children: React.ReactNode }) => {
    const [visivel, setVisivel] = useState(false);
    const pathname = usePathname();

    const exibir = () => setVisivel(true);
    const ocultar = () => setVisivel(false);

    useEffect(() => {
        setVisivel(false);
    }, [pathname]);

    return (
        <ProcessandoContext.Provider value={{ exibir, ocultar, visivel }}>
            {visivel && <Processando />}
            {children}
        </ProcessandoContext.Provider>
    );
};

export const useProcessando = () => useContext(ProcessandoContext);

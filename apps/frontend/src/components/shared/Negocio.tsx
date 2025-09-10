import { IconChecklist, IconClipboardPlus } from "@tabler/icons-react";
import Card from "./Card";
import Link from "next/link";

export default function Negocio() {
    return (
        <div className="flex flex-row items-center justify-center 
            gap-4 w-full lg:w-[70%]">
            <Card titulo="Anuncios">
                <Link href="/anuncio" className="link">
                    <div className="hidden lg:block">
                        <div className="flex items-center justify-center gap-1">
                            <div>
                                <IconChecklist size={50} stroke={2} />
                            </div>
                            <div>
                                <span>Adquira milhas de programas como LATAM Pass, Smiles e TudoAzul.</span>
                            </div>
                        </div>
                    </div>

                    <div className="block lg:hidden">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div>
                                <IconChecklist size={50} stroke={2} />
                            </div>
                            <div>
                                <span>Adquirir milhas</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </Card>
        
            <Card titulo="Anunciar">
                <Link href="/anuncio/cadastro" className="link">
                    <div className="hidden lg:block">
                        <div className="flex items-center justify-center gap-1">
                            <div>
                                <IconClipboardPlus size={50} stroke={2} />
                            </div>
                            <div>
                                <span>Anuncie suas milhas de forma prática e simples, alcance compradores rapidamente.</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="block lg:hidden">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div>
                                <IconClipboardPlus size={50} stroke={2} />
                            </div>
                            <div>
                                <span>Anunciar milhas</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </Card>           
        </div>
    )
}
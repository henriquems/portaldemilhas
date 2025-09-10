'use client'
import Link from 'next/link';
import useSessao from '@/data/hooks/useSessao';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { IconCertificate, IconClipboardText, IconDatabase, IconHome2, IconLicense, IconLogin2, IconLogout2, IconPencilStar, IconPlaneDeparture, IconReceiptDollar, IconShoppingCartDollar, IconTagStarred, IconUserCircle, IconUserPlus, IconUsers } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const MenuPrinicipal = () => {
    const pathname = usePathname();
    const router = useRouter()
    const [ menuOpen, setMenuOpen ] = useState(false);
    const { usuario, isAdministrador, isUsuario, encerrarSessao } = useSessao();
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const administrador = isAdministrador();

    const handleClickLink = () => {
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        encerrarSessao();       
        setMenuOpen(false);           
        router.push('/login'); 
    };

    return (
        <nav>
        <div className="max-w-7xl">
            <div className="flex justify-between h-16 items-center">
                <div className="hidden md:flex space-x-3 items-center">
                    <Link href="/" className={`rounded-md p-2 
                        ${pathname === '/' ? 'bg-blue-700 text-white'
                        : 'hover:bg-blue-700 text-white hover:text-white'
                    }`}>
                        <div className="flex items-center gap-0.5 lg:gap-1">
                            <IconHome2 size={18} />
                            <span className="text-[15px]">Home</span>
                        </div>
                    </Link>

                    {(!usuario || !usuario.assinaturaStatus) && (
                        <Link href="/assinatura/cadastro"
                            onClick={handleClickLink}
                            className={`rounded-md p-2 
                                ${pathname === '/assinatura/cadastro' ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-700 text-white hover:text-white'
                            }`}>
                            <div className="flex items-center gap-0.5 lg:gap-1">
                                <IconPencilStar size={18} />
                                <span className="text-[15px]">Assinar</span>
                            </div>
                        </Link>
                    )}
                    
                    { isAdministrador() && (
                        <>
                            <div className="group relative">
                                <button className="text-white hover:bg-blue-700 
                                    rounded-sm p-2 cursor-pointer">
                                    <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                        <IconClipboardText size={18} />
                                        <span className="text-[15px]">Configurações</span>
                                    </div>
                                </button>
                                <div className="absolute left-0 mt-[0px] hidden group-hover:flex flex-col 
                                    bg-blue-700 shadow-lg rounded-md z-10 min-w-[170px]">
                                    <Link href="/usuario" className={`rounded-md p-2 ml-1 mr-1 mt-1
                                        ${pathname === '/usuario' ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-800 text-white hover:text-white'
                                    }`}>
                                        <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                            <IconUsers size={18} />
                                            <span className="text-[15px]">Usuários</span>
                                        </div>
                                    </Link>

                                    <Link href="/programa" className={`rounded-md p-2 ml-1 mr-1
                                        ${pathname === '/programa' ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-800 text-white hover:text-white'
                                    }`}>
                                        <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                            <IconPlaneDeparture size={18} />
                                            <span className="text-[15px]">Programas</span>
                                        </div>
                                    </Link>

                                    <Link href="/plano" className={`rounded-md p-2 ml-1 mr-1 mb-1
                                        ${pathname === '/plano' ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-800 text-white hover:text-white'
                                    }`}>
                                        <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                            <IconLicense size={18} />
                                            <span className="text-[15px]">Planos</span>
                                        </div>
                                    </Link>

                                    <Link href="/cupom" className={`rounded-md p-2 ml-1 mr-1 mb-1
                                        ${pathname === '/cupom' ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-800 text-white hover:text-white'
                                    }`}>
                                        <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                            <IconCertificate size={18} />
                                            <span className="text-[15px]">Cupons</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )} 
                    
                    <Link href="/anuncio" className={`rounded-md p-2 
                        ${pathname === '/anuncio' ? 'bg-blue-700 text-white'
                        : 'hover:bg-blue-700 text-white hover:text-white'
                    }`}>
                        <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                            <IconShoppingCartDollar size={18} />
                            <span className="text-[15px]">Anuncios</span>
                        </div>
                    </Link>
                    
                    <Link href="/anuncio/cadastro" className={`rounded-md p-2 
                        ${pathname === '/anuncio/cadastro' ? 'bg-blue-700 text-white'
                        : 'hover:bg-blue-700 text-white hover:text-white'
                    }`}>
                        <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                            <IconTagStarred size={18} />
                            <span className="text-[15px]">Anunciar</span>
                        </div>
                    </Link>

                    { !usuario && (
                        <Link href="/cadastro" className={`rounded-md p-2 
                            ${pathname === '/cadastro' ? 'bg-blue-700 text-white'
                            : 'hover:bg-blue-700 text-white hover:text-white'
                        }`}>
                            <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                <IconUserPlus size={18} />
                                <span className="text-[15px]">Cadastro</span>
                            </div>
                        </Link>
                    )}

                    { !usuario && (
                        <Link href="/login" className={`rounded-md p-2 
                            ${pathname === '/login' ? 'bg-blue-700 text-white'
                            : 'hover:bg-blue-700 text-white hover:text-white'
                        }`}>
                            <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                <IconLogin2 size={18} />
                                <span className="text-[15px]">Login</span>
                            </div>
                        </Link>
                    )}


                    { usuario && (
                        <div className="group relative">
                            <button className="text-white hover:bg-blue-700
                                rounded-sm p-2 cursor-pointer">
                                <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                    <IconUserCircle size={18} />
                                    <span className="text-[15px]">Minha Conta</span>
                                </div>
                            </button>
                            <div className="absolute right-0 mr-2 mt-[0px] hidden group-hover:flex flex-col 
                                bg-blue-700 shadow-lg rounded-md z-10 min-w-[180px]">
                                
                                <Link href="/cadastro" className={`rounded-md p-2 ml-1 mr-1 mt-1
                                    ${pathname === '/cadastro'
                                    ? 'bg-blue-800 text-white'
                                    : 'hover:bg-blue-800 text-white'
                                }`}>
                                    <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                        <IconDatabase size={18} />
                                        <span className="text-[15px]">Meus Dados</span>
                                    </div>
                                </Link>

                                <Link href="/assinatura" className={`rounded-md p-2 ml-1 mr-1
                                    ${pathname === '/assinatura'
                                    ? 'bg-blue-700 text-white'
                                    : 'hover:bg-blue-800 text-white'
                                }`}>
                                    <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                        <IconCertificate size={18} />
                                        <span className="text-[15px]">
                                            { administrador ? 'Assinaturas' : 'Minhas Assinaturas'}
                                        </span>
                                    </div>
                                </Link>

                                <Link href="/anuncio/usuario" className={`rounded-md p-2 ml-1 mr-1
                                    ${pathname === '/anuncio/usuario'
                                    ? 'bg-blue-700 text-white'
                                    : 'hover:bg-blue-800 text-white'
                                }`}>
                                    <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                        <IconShoppingCartDollar size={18} />
                                        <span className="text-[15px]">
                                            { administrador ? 'Anuncios' : 'Meus Anuncios'}
                                        </span>
                                    </div>
                                </Link>

                                { !isUsuario() && (
                                    <Link href="/assinatura/cupom" className={`rounded-md p-2 ml-1 mr-1
                                        ${pathname === '/assinatura/cupom'
                                        ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-800 text-white'
                                    }`}>
                                        <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                            <IconReceiptDollar size={18} />
                                            <span className="text-[15px]">
                                                { administrador ? 'Cupons' : 'Meus Cupons'}
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                <Link href="#" onClick={handleLogout} 
                                    className={`rounded-md p-2 ml-1 mr-1 mb-1
                                    ${pathname === '#'
                                    ? 'bg-blue-700 text-white'
                                    : 'hover:bg-blue-800 text-white'
                                }`}>
                                    <div className="flex items-center gap-0.5 lg:gap-1 text-white">
                                        <IconLogout2 size={18} />
                                        <span className="text-[15px]">Sair</span>
                                    </div>
                                </Link>
                            </div>
                        </div>                
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white cursor-pointer">
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </div>

        {menuOpen && (
            <div className="md:hidden absolute top-14 left-0 w-full bg-[#0D1117]">
            <div className="px-4 pt-2 pb-4 space-y-2">
                <Link href="/"
                    className="block hover:bg-blue-700 rounded-sm p-2"
                    onClick={handleClickLink}>
                    <div className="flex items-center gap-1 text-white">
                        <IconHome2 size={20} />
                        <span className="text-[18px]">Home</span>
                    </div>
                </Link>

                 {(!usuario || !usuario.assinaturaStatus) && (
                    <Link href="/assinatura/cadastro"
                        className="block hover:bg-blue-700 rounded-md p-2"
                        onClick={handleClickLink}>
                        <div className="flex items-center gap-1 text-white">
                            <IconPencilStar size={20} />
                            <span className="text-[18px]">Assinar</span>
                        </div>
                    </Link>
                )}

                { isAdministrador() && (
                    <details className="group rounded-sm p-1 hover:bg-blue-700">
                        <summary className="cursor-pointer text-white">
                            <span className="text-[18px]">Configurações</span>
                        </summary> 
                        <div className="mt-1 w-full p-2">
                            <Link href="/usuario" className={`block rounded-md p-2 
                                ${pathname === '/usuario'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconUsers size={20} />
                                    <span className="text-[18px]">Usuários</span>
                                </div>
                            </Link>
                            
                            <Link href="/programa" className={`block rounded-md p-2 
                                ${pathname === '/programa'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconPlaneDeparture size={20} />
                                    <span className="text-[18px]">Programas</span>
                                </div>
                            </Link>

                            <Link href="/plano" className={`block rounded-md p-2 
                                ${pathname === '/plano'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconLicense size={20} />
                                    <span className="text-[18px]">Planos</span>
                                </div>
                            </Link>

                            <Link href="/cupom" className={`block rounded-md p-2 
                                ${pathname === '/cupom'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconCertificate size={20} />
                                    <span className="text-[18px]">Cupons</span>
                                </div>
                            </Link>
                        </div>
                    </details>
                )}
                
                <Link href="/anuncio"
                    className="block hover:bg-blue-700 rounded-sm p-2"
                    onClick={handleClickLink}>
                    <div className="flex items-center gap-1 text-white">
                        <IconShoppingCartDollar size={20} />
                        <span className="text-[18px]">Anuncios</span>
                    </div>
                </Link>

                <Link href="/anuncio/cadastro"
                    className="block hover:bg-blue-700 rounded-sm p-2"
                    onClick={handleClickLink}>
                    <div className="flex items-center gap-1 text-white">
                        <IconTagStarred size={20} />
                        <span className="text-[18px]">Anunciar</span>
                    </div>
                </Link>
                
                <Link href="/cadastro" 
                    className="block hover:bg-blue-700 rounded-sm p-2"
                    onClick={handleClickLink}>
                    <div className="flex items-center gap-1 text-white">
                        <IconUserPlus size={20} />
                        <span className="text-[18px]">Cadastro</span>
                    </div>
                </Link>
                
                { usuario && (
                    <details className="group rounded-sm p-1 hover:bg-blue-700">
                        <summary className="cursor-pointer text-white">
                            <span className="text-[18px]">Minha Conta</span>
                        </summary> 
                        <div className="mt-1 w-full p-2">
                            <Link href="/cadastro" className={`block rounded-md p-2 
                                ${pathname === '/cadastro'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconUserCircle size={20} />
                                    <span className="text-[18px]">Meus Dados</span>
                                </div>
                            </Link>
                            
                            <Link href="/assinatura" className={`block rounded-md p-2 
                                ${pathname === '/assinatura'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconCertificate size={20} />
                                    <span className="text-[18px]">Minhas Assinaturas</span>
                                </div>
                            </Link>

                            <Link href="/anuncio/usuario" className={`block rounded-md p-2 
                                ${pathname === '/anuncio/usuario'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconShoppingCartDollar size={20} />
                                    <span className="text-[18px]">Meus Anuncios</span>
                                </div>
                            </Link>
                            
                            { !isUsuario() && (
                                <Link href="/assinatura/cupom" className={`block rounded-md p-2 
                                ${pathname === '/assinatura/cupom'
                                ? 'bg-blue-700 text-white'
                                : 'hover:bg-blue-800 text-white'
                            }`} onClick={handleClickLink}>
                                <div className="flex items-center gap-1 text-white">
                                    <IconReceiptDollar size={20} />
                                    <span className="text-[18px]">
                                       { isAdministrador() ? 'Cupons' : 'Meus Cupons'} 
                                    </span>
                                </div>
                            </Link>
                            )}
                            
                            { usuario && (
                                <Link href="#" onClick={handleLogout} 
                                    className={`block rounded-md p-2 
                                        ${pathname === '#'
                                        ? 'bg-blue-700 text-white'
                                        : 'hover:bg-blue-800 text-white'
                                    }`}>
                                    <div className="flex items-center gap-1 text-white">
                                        <IconLogout2 size={20} />
                                        <span className="text-[18px]">Sair</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </details>
                )}

                { !usuario && (
                    <Link href="/login" className="block hover:bg-blue-700 rounded-sm p-2"
                        onClick={handleClickLink}>
                        <div className="flex items-center gap-1 text-white">
                            <IconLogin2 size={20} />
                            <span className="text-[18px]">Login</span>
                        </div>
                    </Link>
                )}
            </div>
        </div>
        )}
    </nav>
  );
};

export default MenuPrinicipal;
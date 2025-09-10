'use client'
import { StatusUsuarioTipo, Usuario } from '@portaldemilhas/core'
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import cookie from 'js-cookie'

interface Sessao {
    token: string | null
    usuario: UsuarioComAssinaturaStatus | null
}

interface ContextoSessaoProps {
    carregando: boolean
    token: string | null
    usuario: UsuarioComAssinaturaStatus | null
    iniciarSessao: (token: string) => void
    encerrarSessao: () => void
    isAdministrador: () => boolean
    isInfluencer: () => boolean
    isUsuario: () => boolean
}

const ContextoSessao = createContext<ContextoSessaoProps>({} as ContextoSessaoProps)
export default ContextoSessao

interface ProvedorSessaoProps {
  children: ReactNode
}

interface PayloadJWT {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string
  status: string
  perfis: { nome: string }[]
  exp: number
  assinaturaStatus?: string | null
}

interface UsuarioComAssinaturaStatus extends Usuario {
  assinaturaStatus?: string | null
}

export function ProvedorSessao({ children }: ProvedorSessaoProps) {
    const nomeCookie = '_portaldemilhas_token'

    const [carregando, setCarregando] = useState(true)
    const [sessao, setSessao] = useState<Sessao>({ token: null, usuario: null })

    const carregarSessao = useCallback(function () {
        try {
            setCarregando(true)
            const sessao = obterSessao()
            setSessao(sessao)
        } finally {
            setCarregando(false)
        }
    }, [])

    useEffect(() => {
        carregarSessao()
    }, [carregarSessao])

    function iniciarSessao(token: string) {
        cookie.set(nomeCookie, token, { expires: 1 })
        const sessao = obterSessao()
        setSessao(sessao)
    }

    function encerrarSessao() {
        cookie.remove(nomeCookie)
        setSessao({ token: null, usuario: null })
    }

    function obterSessao(): Sessao {
        const token = cookie.get(nomeCookie)

        if (!token) {
            return { token: null, usuario: null }
        }

        try {
            const payload = jwtDecode<PayloadJWT>(token)
            const valido = payload.exp! > Date.now() / 1000

            if (!valido) {
                return { token: null, usuario: null }
            }

            return {
                token,
                usuario: {
                    id: payload.id,
                    nome: payload.nome,
                    email: payload.email,
                    cpf: payload.cpf,
                    telefone: payload.telefone,
                    status: payload.status as StatusUsuarioTipo,
                    perfis: payload.perfis,
                    assinaturaStatus: payload.assinaturaStatus ?? null,
                } as UsuarioComAssinaturaStatus,
            }
        } catch {
            return { token: null, usuario: null }
        }
    }

    function isAdministrador(): boolean {
        return !!sessao.usuario?.perfis?.some(perfil => perfil.nome === 'ADMINISTRADOR')
    }

    function isInfluencer(): boolean {
        return !!sessao.usuario?.perfis?.some(perfil => perfil.nome === 'INFLUENCER')
    }

    function isUsuario(): boolean {
        return !!sessao.usuario?.perfis?.some(perfil => perfil.nome === 'USUARIO')
    }

    return (
        <ContextoSessao.Provider
            value={{
                carregando,
                token: sessao.token,
                usuario: sessao.usuario,
                iniciarSessao,
                encerrarSessao,
                isAdministrador,
                isInfluencer,
                isUsuario,
            }}
        >
            {children}
        </ContextoSessao.Provider>
    )
}

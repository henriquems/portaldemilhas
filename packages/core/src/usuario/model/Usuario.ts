import { StatusUsuarioTipo } from "./StatusUsuario"
import { Assinatura } from "../../assinatura"
import { Perfil } from "../../perfil"
import { Cupom } from "../../cupom"

export default interface Usuario {
    id?: number
    nome: string
    email: string
    senha?: string
    cpf: string
    telefone: string
    status: StatusUsuarioTipo
    perfis?: Partial<Perfil>[]
    assinaturas?: Assinatura[]
    cupons?: Cupom[]
}
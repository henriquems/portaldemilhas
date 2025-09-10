import { StatusCupomTipo } from "./StatusCupom"
import { Assinatura } from "../../assinatura"
import { Usuario } from "../../usuario"

export default interface Cupom {
    id?: number
    usuario: Usuario
    descricao: string
    valorDesconto: number
    status: StatusCupomTipo
    assinaturas?: Assinatura[]
}
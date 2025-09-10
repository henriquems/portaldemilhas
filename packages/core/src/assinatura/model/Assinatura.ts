import { Cupom } from "../../cupom"
import { Plano } from "../../plano"
import { Usuario } from "../../usuario"
import { PagamentoInfluencer } from "./PagamentoInfluencer"
import { StatusAssinaturaTipo } from "./StatusAssinatura"

export default interface Assinatura {
    id?: number
    usuario: Partial<Usuario>
    plano: Plano
    cupom?: Cupom
    status: StatusAssinaturaTipo
    valor: number
    valorPago?: number
    pagamentoInfluencer: PagamentoInfluencer
    dataPagamento?: Date | null
    dataVencimento?: Date | null
    data: Date 
}
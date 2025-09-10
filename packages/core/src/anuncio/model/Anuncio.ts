import { Programa } from "../../progama"
import { Usuario } from "../../usuario"
import { StatusAnuncioTipo } from "./StatusAnuncio"
import { TipoAnuncioTipo } from "./TipoAnuncio"

export default interface Anuncio {
    id?: number
    usuario: Usuario
    programa: Programa
    tipo: TipoAnuncioTipo
    quantidadeMilhas: number
    valor: number
    status: StatusAnuncioTipo
    data: Date
}
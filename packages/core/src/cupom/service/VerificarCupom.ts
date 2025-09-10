import CasoDeUso from "../../shared/CasoDeUso";
import Cupom from "../model/Cupom";
import RepositorioCupom from "../provider/RepositorioCupom";

type Entrada = {
    descricao: string
}

export default class VerificarCupom implements CasoDeUso<Entrada, Cupom> {
    constructor(private readonly repositorio: RepositorioCupom){}
    
    async executar(entrada: Entrada): Promise<Cupom> {
        const { descricao } = entrada
        if(!descricao) throw new Error('Cupom não informado!')
        
        const cupom = await this.repositorio.verificarCupom(descricao);
        if(!cupom) throw new Error('Cupom não encontrado ou expirado');
        
        return cupom;
    }
}
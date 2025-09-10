import CasoDeUso from "../../shared/CasoDeUso";
import Cupom from "../model/Cupom";
import RepositorioCupom from "../provider/RepositorioCupom";

type Entrada = {
    id: number
}

export default class RecuperarCupom implements CasoDeUso<Entrada, Cupom> {
    constructor(private readonly repositorio: RepositorioCupom){}
    
    async executar(entrada: Entrada): Promise<Cupom> {
        const { id } = entrada
        
        if(!id) throw new Error('Id Cupom não informado!')
        
        const cupom = await this.repositorio.recuperar(id);

        if(!cupom) throw new Error('Cupom não encontrado');
        
         return cupom;
    }
}
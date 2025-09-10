import CasoDeUso from "../../shared/CasoDeUso";
import RepositorioPlano from "../provider/RepositorioPlano";
import Plano from "../model/Plano"

type Entrada = {
    id: number
}

export default class RecuperarPlano implements CasoDeUso<Entrada, Plano> {
    constructor(private readonly repositorio: RepositorioPlano){}
    
    async executar(entrada: Entrada): Promise<Plano> {
        const { id } = entrada
        
        if(!id) throw new Error('Id do plano não informado!')
        
        const plano = await this.repositorio.recuperar(id);

        if(!plano) throw new Error('Plano não encontrado');
        
        return plano;
    }
}
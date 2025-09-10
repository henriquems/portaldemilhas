import CasoDeUso from "../../shared/CasoDeUso";
import Plano from "../model/Plano";
import RepositorioPlano from "../provider/RepositorioPlano";

export default class CadastrarPlano implements CasoDeUso<Plano, void> {
    constructor(
        private readonly repositorio: RepositorioPlano){}

    async executar(plano: Plano): Promise<void> {
        await this.repositorio.salvar(plano);
    }
}
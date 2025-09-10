import CasoDeUso from "../../shared/CasoDeUso";
import Programa from "../model/Programa";
import RepositorioPrograma from "../provider/RepositorioPrograma";

export default class CadastrarPrograma implements CasoDeUso<Programa, void> {
    constructor(
        private readonly repositorio: RepositorioPrograma){}

    async executar(programa: Programa): Promise<void> {
        await this.repositorio.salvar(programa);
    }
}
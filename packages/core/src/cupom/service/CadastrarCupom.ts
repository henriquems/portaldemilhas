import CasoDeUso from "../../shared/CasoDeUso";
import Cupom from "../model/Cupom";
import RepositorioCupom from "../provider/RepositorioCupom";

export default class CadastrarCupom implements CasoDeUso<Cupom, void> {
    constructor(private readonly repositorio: RepositorioCupom) {}

    async executar(cupom: Cupom): Promise<void> {
        await this.repositorio.salvar(cupom);
    }
}

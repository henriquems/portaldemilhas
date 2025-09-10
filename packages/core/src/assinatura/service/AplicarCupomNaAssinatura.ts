import { RepositorioCupom } from "../../cupom";
import CasoDeUso from "../../shared/CasoDeUso";
import Assinatura from "../model/Assinatura";
import RepositorioAssinatura from "../provider/RepositorioAssinatura";

type Entrada = {
  assinaturaId: number
  cupomId: number
}

export default class AplicarCupomNaAssinatura implements CasoDeUso<Entrada, Assinatura> {
  constructor(
    private readonly repositorio: RepositorioAssinatura,
    private readonly repositorioCupom: RepositorioCupom
  ) {}

  async executar(entrada: Entrada): Promise<Assinatura> {
    const { assinaturaId, cupomId } = entrada;

    const assinatura = await this.repositorio.recuperar(assinaturaId);
    if (!assinatura) throw new Error("Assinatura não encontrada");

    const cupom = await this.repositorioCupom.recuperar(cupomId);
    if (!cupom) throw new Error("Cupom não encontrado");

    await this.repositorio.aplicarCupom(assinaturaId, cupomId);

    const desconto = (assinatura.valor * cupom.valorDesconto) / 100;
    assinatura.valor = assinatura.valor - desconto;

    if (assinatura.valor <= 0) {
      assinatura.valor = 0;
      assinatura.valorPago = 0;
      assinatura.status = "PAGA";
      assinatura.dataPagamento = new Date();
    }

    const diasPlano = assinatura.plano.dias;
    const dataAtual = new Date();
    assinatura.dataVencimento = new Date(dataAtual.getTime() + diasPlano * 24 * 60 * 60 * 1000);

    const assinaturaAtualizada = await this.repositorio.salvar(assinatura);

    return assinaturaAtualizada;
  }
}

export class ErroAplicacao extends Error {
  public readonly codigo: string;
  public readonly status: number;

  constructor(codigo: string, mensagem: string, status: number = 400) {
    super(mensagem);
    this.codigo = codigo;
    this.status = status;
  }
}
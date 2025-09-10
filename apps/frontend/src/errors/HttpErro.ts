export class HttpErro extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    const mensagem = HttpErro.extrairMensagem(data);
    super(mensagem);
    this.status = status;
    this.data = data;

    Object.setPrototypeOf(this, HttpErro.prototype);
  }

  static extrairMensagem(data: unknown): string {
    if (
      typeof data === 'object' &&
      data !== null &&
      ('detalhes' in data || 'mensagem' in data || 'message' in data)
    ) {
      const mensagem = data as { detalhes?: string; mensagem?: string; message?: string };
      return mensagem.detalhes || mensagem.mensagem || mensagem.message || 'Erro HTTP';
    }

    return 'Erro HTTP';
  }

  getMensagem(): string {
    return HttpErro.extrairMensagem(this.data);
  }
}

export class LimiteConvitesExcedido extends Error {
    constructor() {
      super('Não há mais convites disponíveis para este período de inscrição.');
      this.name = 'LimiteConvitesExcedido';
    }
}
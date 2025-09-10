export const TipoAnuncio = {
  COMPRA: { descricao: "Compra", cor: "bg-blue-700" },
  VENDA: { descricao: "Venda", cor: "bg-green-700" },
} as const;

export type TipoAnuncioTipo = keyof typeof TipoAnuncio;
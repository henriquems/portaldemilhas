export const StatusAnuncio = {
  ATIVO: { descricao: "Ativo", cor: "bg-blue-700" },
  INATIVO: { descricao: "Inativo", cor: "bg-red-700" },
  VENDIDO: { descricao: "Vendido", cor: "bg-green-700" },
} as const;

export type StatusAnuncioTipo = keyof typeof StatusAnuncio;
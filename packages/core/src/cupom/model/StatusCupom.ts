export const StatusCupom = {
  ATIVO: { descricao: "Ativo", cor: "bg-blue-700" },
  INATIVO: { descricao: "Inativo", cor: "bg-red-700" },
} as const;

export type StatusCupomTipo = keyof typeof StatusCupom;
export const StatusAssinatura = {
  AGUARDANDO: { descricao: "Aguardando", cor: "bg-green-700" },
  RECUSADA: { descricao: "Recusada", cor: "bg-red-700" },
  PENDENTE: { descricao: "Pendente", cor: "bg-orange-700" },
  PAGA: { descricao: "Paga", cor: "bg-blue-700" },
  VENCIDA: { descricao: "Vencida", cor: "bg-violet-700" },
} as const;

export type StatusAssinaturaTipo = keyof typeof StatusAssinatura;
export const StatusUsuario = {
  ATIVO: { descricao: "Ativo", cor: "bg-blue-700" },
  INATIVO: { descricao: "Inativo", cor: "bg-red-700" },
} as const;

export type StatusUsuarioTipo = keyof typeof StatusUsuario;
"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { IconEdit } from "@tabler/icons-react"
import { ColumnMeta, StatusUsuario, StatusUsuarioTipo, Usuario } from "@portaldemilhas/core"
import { ReactNode } from "react"
import Link from "next/link"
import Status from "@/components/shared/Status"
import Deleta from "../../../components/shared/Deleta"

type ColunasProps = (excluir: (id: number) => void) => ColumnDef<Usuario, string | number | ReactNode>[]

export const columns: ColunasProps = (excluir) => [
  {
    accessorFn: (row) => row.perfis?.map(p => p.nome).join(", ") ?? "",
    id: "perfil.nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Perfil</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => <span>{String(getValue())}</span>, 
    meta: { width: "20%" } as ColumnMeta,
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Nome</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { width: "20%" } as ColumnMeta,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">E-mail</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { width: "20%" } as ColumnMeta,
  },
  {
    accessorKey: "telefone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Telefone</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "cpf",
    header: () => <span className="text-slate-400 font-semibold">CPF</span>,
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Status</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status as StatusUsuarioTipo;
      const props = StatusUsuario[status];
      return <Status valor={status} cor={props.cor} descricao={props.descricao} largura="80" />
    },
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    id: "editar",
    header: () => <span className="text-slate-400 font-semibold">Editar</span>,
    cell: ({ row }) => (
      <Link href={`/usuario/cadastro/${row.original.id}`}>
        <IconEdit width={26} height={26} stroke={2} 
          className="text-slate-400 hover:text-slate-300" />
      </Link>
    ),
    meta: { width: "5%" } as ColumnMeta,
  },
  {
    id: "excluir",
    header: () => <span className="text-slate-400 font-semibold">Excluir</span>,
    cell: ({ row }) => (
      <Deleta id={row.original.id!}
        descricao={row.original.nome}
        excluir={excluir}
      />
    ),
    meta: { width: "5%" } as ColumnMeta,
  },
]

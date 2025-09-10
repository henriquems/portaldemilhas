"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { IconEdit } from "@tabler/icons-react"
import { StatusCupom, StatusCupomTipo, Cupom, ColumnMeta } from "@portaldemilhas/core"
import { ReactNode } from "react"
import Link from "next/link"
import Status from "@/components/shared/Status"
import Deleta from "../../../components/shared/Deleta"

type ColunasProps = (excluir: (id: number) => void) => ColumnDef<Cupom, string | number | ReactNode>[]

export const columns: ColunasProps = (excluir) => [ 
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 w-full text-left"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400">Descrição</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-slate-300 truncate">
        {row.original.descricao}
      </div>
    ),
    meta: { width: "50%" } as ColumnMeta,
  },
  {
    accessorFn: (row) => row.usuario?.nome ?? "", 
    id: "usuario.nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Usuário</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-slate-300 truncate">
        {row.original.usuario.nome}
      </div>
    ),
     meta: { width: "20%" } as ColumnMeta,
  },
  {
    accessorKey: "valorDesconto",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="text-slate-400 font-semibold">Valor Desconto</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center text-slate-300 truncate">
        {row.original.valorDesconto} %
      </div>
    ),
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
      const status = row.original.status as StatusCupomTipo;
      const props = StatusCupom[status];
      return <Status valor={status} cor={props.cor} descricao={props.descricao} largura="80" />
    },
     meta: { width: "10%" } as ColumnMeta,
  },
  {
    id: "editar",
    header: () => <span className="text-slate-400 font-semibold">Editar</span>,
    cell: ({ row }) => (
      <Link href={`/cupom/cadastro/${row.original.id}`}>
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
        descricao={row.original.descricao}
        excluir={excluir}
      />
    ),
    meta: { width: "5%" } as ColumnMeta,
  },
]

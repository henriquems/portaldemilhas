'use client'
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Assinatura, ColumnMeta, formatCurrencyBRL, formatDateTimeBR } from "@portaldemilhas/core"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { IconClipboardText, IconX } from "@tabler/icons-react"
import SwitchPagamentoInfluencer from "@/components/shared/SwitchPagamentoInfluencer"
import { ReactNode } from "react"

type ColunasProps = (
  alterarPagamentoInfluencer: (id: number, pagamentoInfluencer: string) => void,
  isAdministrador: () => boolean,
  carregarTotais?: () => Promise<void>
) => ColumnDef<Assinatura, string | number | ReactNode>[]

export const columns: ColunasProps = (alterarPagamentoInfluencer, isAdministrador, carregarTotais) => [
  {
    accessorFn: row => row.cupom?.descricao ?? "",
    id: "cupom",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-slate-400 font-semibold pl-2">Cupom</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="truncate text-slate-400 pl-5">{row.original.cupom?.descricao}</div>,
    meta: { width: "15%" } as ColumnMeta,
  },
  {
    accessorFn: row => row.cupom?.valorDesconto ?? 0,
    id: "desconto",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-center text-slate-400 font-semibold pl-2">Desconto</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="flex justify-center text-slate-400 pl-5">{row.original.cupom?.valorDesconto}%</div>,
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorFn: row => row.plano?.descricao ?? "",
    id: "plano",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-center text-slate-400 font-semibold pl-2">Plano</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="flex justify-center text-slate-400">{row.original.plano.descricao}</div>,
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "valor",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-center text-slate-400 font-semibold">Valor</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="flex justify-center text-slate-400">{formatCurrencyBRL(row.original.valor)}</div>,
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "valorPago",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-center text-slate-400 font-semibold">Valor pago</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="flex justify-center text-slate-400">{formatCurrencyBRL(row.original.valorPago)}</div>,
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "valorReceber",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-center text-slate-400 font-semibold">Valor influencer</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const valorReceber = row.original.valorPago ? row.original.valorPago / 2 : 0
      return <div className="flex justify-center text-slate-400">{formatCurrencyBRL(valorReceber)}</div>
    },
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-center text-slate-400 font-semibold pl-2">Assinatura</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="flex justify-center text-slate-400">{row.original.status}</div>,
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    accessorKey: "pagamentoInfluencer",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="text-center text-slate-400 font-semibold pl-2">Influencer</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <SwitchPagamentoInfluencer
        row={row}
        alterarPagamentoInfluencer={alterarPagamentoInfluencer}
        carregarTotais={carregarTotais}
        isAdministrador={isAdministrador}
      />
    ),
    meta: { width: "10%" } as ColumnMeta,
  },
  {
    id: "detalhes",
    header: () => <div className="flex justify-center text-slate-400 font-semibold">Detalhes</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <IconClipboardText size={30} title="Detalhes" className="text-slate-400 hover:text-slate-300 cursor-pointer" />
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="max-w-[98%] lg:max-w-[650px] bg-zinc-800 border border-zinc-800 p-2 lg:p-6"
          >
            <DialogClose asChild>
              <button className="absolute right-6 top-2 lg:top-4 cursor-pointer">
                <IconX width={22} height={22} stroke={3} title="Fechar" />
              </button>
            </DialogClose>
            <DialogHeader>
              <DialogTitle className="font-bold">Detalhes do Cupom</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 rounded-lg text-white mt-2 mb-2">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-zinc-400">Cupom</label>
                  <span>{row.original.cupom?.descricao}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Influencer</label>
                  <span>{row.original.cupom?.usuario.nome}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Valor</label>
                  <span>{row.original.cupom?.valorDesconto}%</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Status Cupom</label>
                  <span>{row.original.cupom?.status}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Usado por</label>
                  <span>{row.original.usuario.nome}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Status assinatura</label>
                  <span>{row.original.status}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Data assinatura</label>
                  <span>{formatDateTimeBR(row.original.data)}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Data Pagamento</label>
                  <span>{row.original.dataPagamento ? formatDateTimeBR(row.original.dataPagamento) : "AGUARDANDO"}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Data Vencimento</label>
                  <span>{row.original.dataPagamento ? formatDateTimeBR(row.original.dataVencimento) : "AGUARDANDO"}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Plano</label>
                  <span>{row.original.plano.descricao}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Valor</label>
                  <span>{formatCurrencyBRL(row.original.plano.valor)}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Valor Pago</label>
                  <span>{formatCurrencyBRL(row.original.valorPago)}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Pagamento Influencer</label>
                  <span>{row.original.pagamentoInfluencer ? row.original.pagamentoInfluencer : 'AGUARDANDO'}</span>
                </div>
                <div className="flex flex-col">
                  <label className="text-zinc-400">Valor Influencer</label>
                  <span>{formatCurrencyBRL((row.original.valorPago ?? 0) / 2)}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ),
    meta: { width: "5%" } as ColumnMeta,
  },
]

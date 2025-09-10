"use client"
import {
  ColumnDef,
  SortingState,
  flexRender,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import { Input } from "@/components/ui/input"
import { PaginationWithLinks } from "@/components/ui/pagination-with-links"
import Processando from "@/components/shared/Processando"
import { ColumnMeta } from "@portaldemilhas/core"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: number
  pageSize: number
  totalCount: number
  carregando: boolean
}

export function DataTable<TData, TValue>({columns, data, page, pageSize, totalCount, carregando}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), 
    onSortingChange: setSorting, 
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 mb-2">
        <Input
          placeholder="Filtrar por descrição"
          value={(table.getColumn("descricao")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("descricao")?.setFilterValue(event.target.value)
          }
          className="max-w h-10 bg-gray-950 border-gray-800 !placeholder-slate-300 text-slate-300"
        />

        <Input
          placeholder="Filtrar por companhia"
          value={(table.getColumn("companhia")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("companhia")?.setFilterValue(event.target.value)
          }
          className="max-w h-10 bg-gray-950 border-gray-800 !placeholder-slate-300 text-slate-300"
        />
      </div>
      <div className="rounded-md border border-gray-800 !placeholder-slate-300">
        <Table className="rounded-t-md overflow-hidden">
          <TableHeader className="bg-gray-950 text-slate-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-gray-950 transition-colors">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-gray-950 border-b border-gray-800 text-slate-300"
                      style={{ width: (header.column.columnDef.meta as ColumnMeta)?.width }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
          {carregando ? (
            <TableRow className="bg-transparent hover:bg-transparent border-none">
              <TableCell
                colSpan={columns.length}
                className="h-36 text-center bg-transparent border-none text-slate-300"
              >
                <Processando />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-gray-800 transition-colors"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border-t border-gray-800 text-slate-300 truncate"
                    style={{ width: (cell.column.columnDef.meta as ColumnMeta)?.width }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-14 text-center text-slate-300 hover:bg-slate-900">
                Nenhum programa cadastrado no sistema!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-3">
        <PaginationWithLinks page={page} pageSize={pageSize} totalCount={totalCount} />
      </div>
    </div>
  )
}
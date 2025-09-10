import { PagamentoInfluencer } from "@portaldemilhas/core"
import { useState } from "react"
import { toast } from "react-toastify"
import { Switch } from "../ui/switch"

type RowData = {
  original: {
    id?: number
    status: string
    pagamentoInfluencer: PagamentoInfluencer
  }
}

export default function SwitchPagamentoInfluencer({
  row,
  alterarPagamentoInfluencer,
  carregarTotais,
  isAdministrador,
}: {
  row: RowData
  alterarPagamentoInfluencer: (id: number, pagamentoInfluencer: PagamentoInfluencer) => void | Promise<void>
  carregarTotais?: () => Promise<void>
  isAdministrador: () => boolean
}) {
  const [checked, setChecked] = useState(
    row.original.pagamentoInfluencer === PagamentoInfluencer.PAGO
  )

  const toggleSwitch = async () => {
    const novoValor: PagamentoInfluencer = checked
      ? PagamentoInfluencer.AGUARDANDO
      : PagamentoInfluencer.PAGO

    setChecked(!checked)
    row.original.pagamentoInfluencer = novoValor

    try {
      if (row.original.id != null) {
        await alterarPagamentoInfluencer(row.original.id, novoValor)
        toast.success(`Pagamento Influencer alterado para ${novoValor}`)
      }
      if (carregarTotais) {
        await carregarTotais()
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao alterar pagamento do influencer")

      setChecked(checked)
      row.original.pagamentoInfluencer = checked
        ? PagamentoInfluencer.PAGO
        : PagamentoInfluencer.AGUARDANDO
    }
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="flex gap-2 items-center w-full">
        {isAdministrador() && (
          <Switch
            disabled={row.original.status !== "PAGA"}
            checked={checked}
            onCheckedChange={toggleSwitch}
            className="
              bg-white border-2 border-slate-300 
              data-[state=checked]:bg-blue-500 
              data-[state=checked]:border-blue-500 
              data-[state=unchecked]:bg-red-500 
              data-[state=unchecked]:border-red-500
              cursor-pointer
            "
          />
        )}
        <span className="text-slate-400 font-semibold">
          {checked ? "PAGO" : "AGUARDANDO"}
        </span>
      </div>
    </div>
  )
}

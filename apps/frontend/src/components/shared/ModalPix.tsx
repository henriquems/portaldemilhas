import { useEffect, useState } from "react";
import { QrCodePix } from "@portaldemilhas/core";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

interface ModalPixProps {
  idPagamento: number;
  assinaturaId: number;
  token: string;
  qrCode: QrCodePix;
}

export function ModalPix({ idPagamento, assinaturaId, token, qrCode }: ModalPixProps) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!idPagamento) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pagamento/status/${idPagamento}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const status = res.data?.status?.toLowerCase?.();
        if (status === "approved") {
          clearInterval(interval);
          window.location.href = `/pagamento/sucesso/${assinaturaId}`;
        } else if (["rejected", "cancelled"].includes(status)) {
          clearInterval(interval);
          window.location.href = `/pagamento/falha/${assinaturaId}`;
        }
      } catch (err) {
        console.error("Erro ao verificar status do PIX:", err);
      }
    }, 5000);

    const timeout = setTimeout(() => clearInterval(interval), 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [idPagamento, assinaturaId, token]);

  const copiarCodigoPix = async () => {
    try {
      await navigator.clipboard.writeText(qrCode.code); 
      setCopiado(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("Erro ao copiar código Pix");
    }
  };

  return (
    <>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />

      <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-800 p-6 focus:outline-none shadow-lg">
        <Dialog.Title className="text-lg font-bold mb-2 text-center">Pagamento via PIX</Dialog.Title>
        <p className="text-center mb-4">Aguardando confirmação de pagamento...</p>

        {qrCode?.base64 ? (
          <Image
            src={`data:image/png;base64,${qrCode.base64}`}
            alt="QR Code Pix"
            className="mx-auto mb-4"
            width={250}
            height={250}
          />
        ) : (
          <p className="text-center">QR Code não disponível</p>
        )}

        {/* Código copia e cola */}
        {qrCode?.code && (
          <div className="mt-4">
            <label className="text-white text-sm font-medium mb-1 block">Código Pix (copia e cola)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={qrCode.code}
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 text-sm overflow-x-auto"
              />
              <button
                onClick={copiarCodigoPix}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded"
              >
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Dialog.Close asChild>
            <button
              className="mt-6 px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 text-white"
              type="button"
            >
              Fechar
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </>
  );
}

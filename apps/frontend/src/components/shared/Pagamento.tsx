'use client';
import usePagamento from '@/data/hooks/usePagamento';
import { formatCurrencyBRL, PagamentoProps, validarCPFCNPJ } from '@portaldemilhas/core';
import Processando from './Processando';
import logoMercado from '/public/logo-mercado.png';
import Image from 'next/image';
import { Button } from '../ui/button';
import { IconCreditCard, IconQrcode, IconTransferIn } from '@tabler/icons-react';
import { CardPayment } from '@mercadopago/sdk-react';
import { toast } from 'react-toastify';
import { Dialog } from '../ui/dialog';
import { ModalPix } from './ModalPix';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';

export default function Pagamento({ assinaturaId, valor, plano }: PagamentoProps) {
  const { form, usuario, token, emailUsuario, setEmailUsuario,
    cpf, setCpf, metodo, setMetodo, onSubmit, iniciarPagamento, 
    qrCodePix, idPagamento, openPixModal, setOpenPixModal, processando,
    processandoCupom, initialization, customization, verificarCupom, cupom
  } = usePagamento({ assinaturaId, valor, plano });

  const valorPlano = plano.valor;

  const totalComDesconto = cupom
    ? Number((valorPlano - (valorPlano * cupom.valorDesconto) / 100).toFixed(2))
    : valorPlano;

  if (!usuario) return <Processando />;

  return (
    <>
      {processando && <Processando />}
      <div className="flex flex-col gap-1 w-full lg:w-[50%]">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-slate-800 p-2 rounded-lg mb-5">
          <Image src={logoMercado} alt="logo mercado pago" width={180} height={130} />

          <div className="border border-slate-800 p-1 rounded-lg bg-slate-800 w-full">
            <h2 className="text-white text-lg font-semibold mb-2">Resumo do Pedido</h2>
            
            <div className="flex justify-between text-slate-300">
              <span>Plano:</span>
              <span>{plano.descricao}</span>
            </div>
            <div className="flex justify-between text-slate-300 mt-1">
              <span>Valor:</span>
              <span>{formatCurrencyBRL(plano.valor)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 mt-5 mb-5">
              <span className="w-24">Cupom:</span>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(verificarCupom)} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="cupom"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} className="bg-zinc-300 border border-zinc-500 text-zinc-900" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button type="submit" className="botao primario" disabled={processandoCupom}>
                    {processandoCupom ? "Aplicando..." : <><IconTransferIn size={20} /> Aplicar</>}
                  </button>
                </form>
              </Form>
            </div>
            {cupom && (
              <div className="flex justify-between text-slate-300 mt-1">
                <span>Valor desconto:</span>
                <span className="font-semibold">{cupom?.valorDesconto}%</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-lg mt-3 border-t border-slate-600 pt-2">
              <span>Total a pagar:</span>
              <span className="text-orange-500">{formatCurrencyBRL(totalComDesconto)}</span>
            </div>
          </div>
        </div>

        <span className="text-slate-300 font-semibold">Tipo de pagamento</span>
        <div className="flex gap-2 w-full mt-2 mb-3 ">
          <Button onClick={() => setMetodo('cartao')} 
            variant={metodo === 'cartao' ? 'default' : 'outline'} 
            className={`${metodo === 'cartao' ? 'bg-blue-600 hover:bg-blue-700' : ''} w-full px-3 h-11 text-[16px] cursor-pointer`}>
            <IconCreditCard /> Cartão
          </Button>
          <Button onClick={() => setMetodo('pix')} 
            variant={metodo === 'pix' ? 'default' : 'outline'} 
            className={`${metodo === 'pix' ? 'bg-orange-600 hover:bg-orange-700' : ''} w-full px-3 h-11 text-[16px] cursor-pointer`}>
            <IconQrcode /> Pix
          </Button>
          {/*
            <Button onClick={() => setMetodo('boleto')} 
              variant={metodo === 'boleto' ? 'default' : 'outline'} 
              className={`${metodo === 'boleto' ? 'bg-green-600 hover:bg-green-700' : ''} w-full px-3 h-11 text-[16px] cursor-pointer`}>
              <IconFileBarcode /> Boleto
            </Button>
          */}
        </div>

        {(metodo === 'pix' || metodo === 'boleto') && (
          <div className="flex flex-col lg:flex-row items-center gap-2 mb-3">
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="email" className="text-slate-300 font-medium">E-mail</label>
              <input
                id="email"
                type="email"
                value={emailUsuario}
                onChange={(e) => setEmailUsuario(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                required
              />
            </div>
            
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="cpf" className="text-slate-300 font-medium">CPF</label>
              <input
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                required
              />
            </div>
          </div>
        )}

        {metodo === 'cartao' && (
          <CardPayment
            initialization={initialization}
            customization={customization}
            onSubmit={onSubmit}
          />
        )}

        {(metodo === 'pix' || metodo === 'boleto') && (
          <Button
            onClick={() => {
              if (!emailUsuario || !emailUsuario.includes('@')) {
                toast.error('Informe um e-mail válido.');
                return;
              }

              if (!validarCPFCNPJ(cpf)) {
                toast.error('Informe um CPF válido.');
                return;
              }

              iniciarPagamento(metodo);
            }}
            className="bg-blue-600 hover:bg-blue-700 
              px-4 h-11 text-[16px] w-full cursor-pointer"
          >
            Realizar pagamento via {metodo === 'pix' ? 'Pix' : 'Boleto'}
          </Button>
        )}
      </div>

      <Dialog open={openPixModal} onOpenChange={setOpenPixModal}>
        {qrCodePix && idPagamento && token && (
          <ModalPix
            idPagamento={idPagamento}
            assinaturaId={assinaturaId}
            token={token}
            qrCode={qrCodePix}
          />
        )}
      </Dialog>
    </>
  );
}

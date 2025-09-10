export function formatCurrencyBRL(valor: number | null | undefined): string {
  if (typeof valor !== 'number') return 'R$ 0,00';
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
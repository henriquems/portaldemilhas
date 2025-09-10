export function separarNome(nomeCompleto?: string) {
  const partes = (nomeCompleto ?? '').trim().split(' ').filter(Boolean);
  const first_name = partes[0] ?? 'Não Informado';
  const last_name = partes.slice(1).join(' ') || 'Não Informado';
  return { first_name, last_name };
}

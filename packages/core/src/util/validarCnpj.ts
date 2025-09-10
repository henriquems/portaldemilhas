export function validaCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const t = cnpj.length - 2;
  const d = cnpj.substring(t);
  const c = cnpj.substring(0, t);
  const calc = (x: number) => {
    let n = 0;
    for (let i = 0; i < x; i++) {
      n += parseInt(c.charAt(i)) * ((x + 1 - i) % 8 || 9);
    }
    const r = n % 11;
    return r < 2 ? 0 : 11 - r;
  };

  const d1 = calc(t);
  const d2 = calc(t + 1);

  return d === `${d1}${d2}`;
}

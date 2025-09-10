import { validaCNPJ } from "./validarCnpj";
import { validarCPF } from "./validarCpf";

export function validarCPFCNPJ(value: string): boolean {
  const onlyDigits = value.replace(/\D/g, '');

  if (onlyDigits.length === 11) {
    return validarCPF(onlyDigits);
  } else if (onlyDigits.length === 14) {
    return validaCNPJ(onlyDigits);
  }

  return false;
}
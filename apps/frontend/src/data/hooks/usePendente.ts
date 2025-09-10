import { useCallback, useEffect, useState } from "react";
import useAPI from "./useAPI";
import useSessao from "./useSessao";
import { Usuario } from "@portaldemilhas/core";

export default function usePendente() {
  const { httpGet } = useAPI();
  const { usuario } = useSessao();
  const [contemAssinatura, setContemAssinatura] = useState<boolean>();
  const [assinaturaPaga, setAssinaturaPaga] = useState<boolean>(false);

  const recuperar = useCallback(
    async (id: number) => {
      return await httpGet<Usuario>(`/usuarios/${id}`);
    },
    [httpGet]
  );

  useEffect(() => {
    const carregarUsuario = async () => {
      if (!usuario?.id) return;

      const usuarioRecuperado = await recuperar(usuario.id);

      const assinaturas = usuarioRecuperado?.assinaturas ?? [];

      if (assinaturas.length === 0) {
        setContemAssinatura(false);
        setAssinaturaPaga(false);
      } else {
        setContemAssinatura(true);

        const ultimaAssinatura = assinaturas.reduce((maisRecente, atual) =>
            (atual.id ?? 0) > (maisRecente.id ?? 0) ? atual : maisRecente
        );

        setAssinaturaPaga(ultimaAssinatura.status === "PAGA");
      }
    };

    carregarUsuario();
  }, [usuario, recuperar]);

  return { usuario, contemAssinatura, assinaturaPaga };
}

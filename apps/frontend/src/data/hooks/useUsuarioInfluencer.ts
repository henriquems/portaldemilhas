import { useCallback, useEffect, useState } from "react";
import { Usuario } from "@portaldemilhas/core";
import useAPI from "./useAPI";

export default function useUsuarioInfluencer() {
    const { httpGet } = useAPI()
    const [ usuarioInfluencers, setUsuarioInfluencers ] = useState<Usuario[]>([]) 
    
    const listar = useCallback(async () => {
        const resposta = await httpGet<Usuario[]>('/usuarios/influencer')
        setUsuarioInfluencers(resposta ?? [])
    }, [httpGet])
    
    useEffect(() => {
        listar()
    }, [listar])

    return {
        usuarioInfluencers
    }
}
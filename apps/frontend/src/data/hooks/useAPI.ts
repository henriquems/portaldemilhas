import useSessao from "./useSessao";
import { HttpErro } from "../../errors/HttpErro";
import { useCallback } from "react";

export default function useAPI() {
  const { token } = useSessao();
  const urlBase = process.env.NEXT_PUBLIC_API_URL;

  const httpGet = useCallback(<T = unknown>(caminho: string): Promise<T> => {
    const uri = caminho.startsWith("/") ? caminho : `/${caminho}`;
    const urlCompleta = `${urlBase}${uri}`;

    const headers: HeadersInit = {};
    if (token?.trim()) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(urlCompleta, { headers }).then(async (resposta) => {
      let data: unknown = {};
      try {
        data = await resposta.json();
      } catch {
        data = {};
      }

      if (!resposta.ok) {
        throw new HttpErro(resposta.status, data);
      }

      return data as T;
    });
  }, [token, urlBase]);

  const httpDelete = useCallback(<T = unknown>(caminho: string): Promise<T> => {
    const uri = caminho.startsWith("/") ? caminho : `/${caminho}`;
    const urlCompleta = `${urlBase}${uri}`;

    return fetch(urlCompleta, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(extrairDados<T>);
  }, [token, urlBase]);

  const httpPost = useCallback(<T = unknown>(caminho: string, body: unknown): Promise<T> => {
      const uri = caminho.startsWith("/") ? caminho : `/${caminho}`;
      const urlCompleta = `${urlBase}${uri}`;

      return fetch(urlCompleta, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }).then(async (resposta) => {
        const contentType = resposta.headers.get("Content-Type");

        if (!resposta.ok) {
          let data: unknown = { message: "Erro desconhecido" };

          try {
            const texto = await resposta.text(); 
            data = texto ? JSON.parse(texto) : {};
          } catch (e) {
            console.error("Erro ao tentar ler ou parsear resposta:", e);
          }

          throw new HttpErro(resposta.status, data);
        }

        if (
          contentType?.includes("application/pdf") ||
          contentType?.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        ) {
          return resposta.blob() as unknown as T;
        }

        return extrairDados<T>(resposta);
      });
  }, [token, urlBase]);

  const httpPatch = useCallback(<T = unknown>(caminho: string, body: unknown): Promise<T> => {
    const uri = caminho.startsWith("/") ? caminho : `/${caminho}`;
    const urlCompleta = `${urlBase}${uri}`;

    return fetch(urlCompleta, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then(async (resposta) => {
      const contentType = resposta.headers.get("Content-Type");

      if (!resposta.ok) {
        let data: unknown = { message: "Erro desconhecido" };

        try {
          const texto = await resposta.text(); 
          data = texto ? JSON.parse(texto) : {};
        } catch (e) {
          console.error("Erro ao tentar ler ou parsear resposta:", e);
        }

        throw new HttpErro(resposta.status, data);
      }

      if (
        contentType?.includes("application/pdf") ||
        contentType?.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      ) {
        return resposta.blob() as unknown as T;
      }

      return extrairDados<T>(resposta);
    });
  }, [token, urlBase]);

  async function httpPostFormDataComProgresso<T = unknown>(
    caminho: string,
    formData: FormData,
    onProgresso?: (percentual: number) => void
  ): Promise<T> {
    const uri = caminho.startsWith("/") ? caminho : `/${caminho}`;
    const urlCompleta = `${urlBase}${uri}`;

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", urlCompleta);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgresso) {
          const percentual = Math.round((event.loaded / event.total) * 100);
          onProgresso(percentual);
        }
      };

      xhr.onload = () => {
        try {
          const respostaJson = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(respostaJson as T);
          } else {
            reject(new HttpErro(xhr.status, respostaJson));
          }
        } catch {
          reject(new HttpErro(xhr.status, { message: "Erro ao processar resposta" }));
        }
      };

      xhr.onerror = () => {
        reject(new HttpErro(xhr.status, { message: "Erro na requisição" }));
      };

      xhr.send(formData);
    });
  }

  async function extrairDados<T>(resposta: Response): Promise<T> {
    const contentType = resposta.headers.get("Content-Type");

    if (contentType?.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      return resposta.blob() as unknown as T;
    }

    if (contentType?.includes("application/json")) {
      try {
        const conteudo = await resposta.json();
        return conteudo as T;
      } catch (error) {
        console.error("Erro ao tentar parsear JSON:", error);
        throw new Error("Erro ao processar resposta JSON");
      }
    }

    try {
      const conteudo = await resposta.text();
      return conteudo as unknown as T;
    } catch (error) {
      console.error("Erro ao processar resposta de texto:", error);
      throw new Error("Erro ao processar resposta de texto");
    }
  }

  return { httpGet, httpPost, httpDelete, httpPatch, httpPostFormDataComProgresso };
}

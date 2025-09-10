import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import useAPI from './useAPI';
import useSessao from './useSessao';
import { useProcessando } from '../contexts/ContextoProcessando';

const loginSchema = z.object({
  email: z.string().min(1, { message: 'Favor informar o campo e-mail!' }),
  senha: z.string().min(1, { message: 'Favor informar o campo senha!' }),
});

interface ErroComMensagem {
  message?: string;
  data?: {
    message?: string;
  };
}

export default function useLogin() {
  const router = useRouter();
  const { httpPost } = useAPI();
  const { iniciarSessao } = useSessao();
  const { exibir, ocultar } = useProcessando();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const logar = async () => {
    exibir();
    try {
      const token = await httpPost<string>('/auth/logar', {
        email: form.getValues('email'),
        senha: form.getValues('senha'),
      });

      iniciarSessao(token);
      router.push('/');
    } catch (error: unknown) {
      let mensagem = 'Erro ao efetuar login';

      if (typeof error === 'object' && error !== null) {
        const e = error as ErroComMensagem;
        mensagem = e.data?.message ?? e.message ?? mensagem;
      }

      toast.warning(mensagem);
      form.setValue('senha', '');
    } finally {
      ocultar();
    }
  };

  return {
    logar,
    form,
  };
}


import { useState } from 'react';
import { chamar, mensagemDeErro } from './api.js';

export default function Login({ onEntrar }) {
  const [modo, setModo] = useState('entrar');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  // TAREFA 3: validacao no navegador
  function validar() {
    if (usuario.trim() === '') {
      return 'O usuário é obrigatório.';
    }

    if (senha.length < 4) {
      return 'A senha precisa ter pelo menos 4 caracteres.';
    }

    return '';
  }

  // Entrar na conta
  async function entrar() {
    const r = await chamar('POST', '/login', { usuario, senha });

    if (r.status === 200) {
      onEntrar(r.dados);
    } else {
      setErro(mensagemDeErro(r, 'POST /login'));
    }
  }

  // Cadastrar usuario
  async function cadastrar() {
    const r = await chamar('POST', '/cadastro', { usuario, senha });

    if (r.status === 201) {
      setModo('entrar');
      setSenha('');
      setAviso('Cadastro feito. Agora é só entrar.');
    } else {
      setErro(mensagemDeErro(r, 'POST /cadastro'));
    }
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');
    setAviso('');

    const problema = validar();

    if (problema !== '') {
      setErro(problema);
      return;
    }

    setEnviando(true);

    try {
      if (modo === 'entrar') {
        await entrar();
      } else {
        await cadastrar();
      }
    } catch {
      setErro('Não consegui falar com a API.');
    }

    setEnviando(false);
  }

  function trocarModo() {
    setModo(modo === 'entrar' ? 'cadastrar' : 'entrar');
    setErro('');
    setAviso('');
  }

  return (
    <form className="cartao" onSubmit={enviar}>
      <h2>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</h2>

      {/* TAREFA 2: campos controlados */}
      <div className="campo">
        <label htmlFor="usuario">Usuário</label>
        <input
          id="usuario"
          autoComplete="username"
          value={usuario}
          onChange={(evento) => setUsuario(evento.target.value)}
        />
      </div>

      <div className="campo">
        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />
      </div>

      <button type="submit" disabled={enviando}>
        {modo === 'entrar' ? 'Entrar' : 'Cadastrar'}
      </button>{' '}

      <button type="button" className="secundario" onClick={trocarModo}>
        {modo === 'entrar' ? 'Não tenho conta' : 'Já tenho conta'}
      </button>

      {aviso && <p className="mensagem-ok">{aviso}</p>}

      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}

      {modo === 'entrar' && (
        <p className="suave">
          Usuários de teste: <code>diego</code> / <code>1234</code> e{' '}
          <code>aluno</code> / <code>senha</code>.
        </p>
      )}
    </form>
  );
}

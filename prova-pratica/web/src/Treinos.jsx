
import { useEffect, useState } from 'react';
import { chamar, mensagemDeErro } from './api.js';
import CartaoTreino from './CartaoTreino.jsx';

export default function Treinos({ onSessaoExpirada }) {
  const [treinos, setTreinos] = useState([]);
  const [total, setTotal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');

  // Busca os treinos e o total na API
  async function carregar() {
    try {
      const lista = await chamar('GET', '/treinos');

      if (lista.status === 200) {
        setTreinos(lista.dados);
      } else {
        setErro(mensagemDeErro(lista, 'GET /treinos'));
      }

      const t = await chamar('GET', '/treinos/total');
      setTotal(t.status === 200 && t.json ? t.dados.total : null);
    } catch {
      setErro('Não consegui falar com a API.');
    }

    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  // Trata respostas que exigem login
  function conferir(r, rota) {
    if (r.status === 401) {
      onSessaoExpirada();
      return false;
    }

    if (r.status >= 400) {
      setErro(mensagemDeErro(r, rota));
      return false;
    }

    setErro('');
    return true;
  }

  // Cadastra um novo treino
  async function enviarNovoTreino() {
    const r = await chamar('POST', '/treinos', {
      nome: nome.trim(),
      duracao: Number(duracao),
    });

    if (conferir(r, 'POST /treinos')) {
      setNome('');
      setDuracao('');
      carregar();
    }
  }

  // Conclui um treino
  async function concluir(id) {
    const r = await chamar('PUT', `/treinos/${id}/concluir`);

    if (conferir(r, 'PUT /treinos/:id/concluir')) {
      carregar();
    }
  }

  // Apaga um treino
  async function apagar(id) {
    const r = await chamar('DELETE', `/treinos/${id}`);

    if (conferir(r, 'DELETE /treinos/:id')) {
      carregar();
    }
  }

  // TAREFA 6: validação do formulário
  function aoEnviar(evento) {
    evento.preventDefault();

    if (nome.trim() === '') {
      setErro('O nome do treino é obrigatório.');
      return;
    }

    const minutos = Number(duracao);

    if (
      duracao.trim() === '' ||
      !Number.isInteger(minutos) ||
      minutos < 1 ||
      minutos > 180
    ) {
      setErro('A duração deve ser um número inteiro entre 1 e 180 minutos.');
      return;
    }

    setErro('');
    enviarNovoTreino();
  }

  return (
    <>
      {/* TAREFA 5: campos controlados */}
      <form className="cartao" onSubmit={aoEnviar}>
        <h2>Novo treino</h2>

        <div className="linha-form">
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
          </div>

          <div>
            <label htmlFor="duracao">Duração (min)</label>
            <input
              id="duracao"
              type="number"
              min="1"
              max="180"
              step="1"
              value={duracao}
              onChange={(evento) => setDuracao(evento.target.value)}
            />
          </div>

          <button type="submit">Adicionar</button>
        </div>
      </form>

      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}

      <section className="cartao">
        <h2>
          Meus treinos{' '}
          <span className="selo">
            {total === null ? 'total: ?' : `total: ${total}`}
          </span>
        </h2>

        {carregando && (
          <p className="suave">Carregando...</p>
        )}

        {/* TAREFA 7: estado vazio */}
        {!carregando && treinos.length === 0 && (
          <p className="suave">
            Nenhum treino ainda. Cadastre o primeiro acima.
          </p>
        )}

        {/* TAREFA 8: lista de treinos */}
        <ul className="lista">
          {treinos.map((t) => (
            <CartaoTreino
              key={t.id}
              treino={t}
              onConcluir={concluir}
              onApagar={apagar}
            />
          ))}
        </ul>
      </section>
    </>
  );
}

// ---------------------------------------------------------------
// TAREFA 4: um componente que desenha UM treino da lista.

export default function CartaoTreino({ treino, onConcluir, onApagar }) {
  const concluido = Boolean(treino.concluido);

  return (
    <li className="item">
      <div className="item-info">
        <strong>{treino.nome}</strong>
        <span className="suave">{treino.duracao} min</span>
      </div>

      <div className="acoes">
        {concluido ? (
          <span className="selo feito">concluído</span>
        ) : (
          <button
            className="secundario"
            onClick={() => onConcluir(treino.id)}
          >
            Concluir
          </button>
        )}

        <button
          className="perigo"
          onClick={() => onApagar(treino.id)}
        >
          Apagar
        </button>
      </div>
    </li>
  );
}
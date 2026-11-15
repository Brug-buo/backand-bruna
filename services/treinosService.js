
const repository = require('../repositories/treinosRepository.js');

// Validar os dados do treino
function validarTreino(corpo) {
    if (!corpo || typeof corpo.nome !== 'string' || corpo.nome.trim() === '') {
        return 'O campo nome e obrigatorio e deve ser um texto.';
    }

    if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
        return 'O campo duracao e obrigatorio e deve ser um numero maior que zero.';
    }

    return null;
}

// Listar todos os treinos
function listarTodos() {
    return repository.listarTodos();
}

// Buscar treino pelo ID
function buscarPorId(id) {
    return repository.buscarPorId(id);
}

// Criar treino
function criarTreino(corpo) {
    const erro = validarTreino(corpo);

    if (erro !== null) {
        return { erro: erro };
    }

    const novo = repository.criar(corpo.nome, corpo.duracao);

    return { treino: novo };
}

// Atualizar treino
function atualizarTreino(id, corpo) {
    const existente = repository.buscarPorId(id);

    if (existente === undefined) {
        return { naoEncontrado: true };
    }

    const erro = validarTreino(corpo);

    if (erro !== null) {
        return { erro: erro };
    }

    const atualizado = repository.atualizar(
        id,
        corpo.nome,
        corpo.duracao
    );

    return { treino: atualizado };
}

// Remover treino
function removerTreino(id) {
    const existente = repository.buscarPorId(id);

    if (existente === undefined) {
        return { naoEncontrado: true };
    }

    repository.remover(id);

    return { removido: true };
}

// Contar todos os treinos
function contarTreinos() {
    return repository.contarTodos();
}

// Listar treinos por duração mínima
function listarPorDuracao(minimo) {
    return repository.listarPorDuracao(minimo);
}

// Buscar treinos pelo nome
function buscarPorNome(nome) {
    return repository.buscarPorNome(nome);
}

// Obter resumo estatístico
function resumoTreinos() {
    return repository.resumo();
}

module.exports = {
    listarTodos,
    buscarPorId,
    criarTreino,
    atualizarTreino,
    removerTreino,
    contarTreinos,
    listarPorDuracao,
    buscarPorNome,
    resumoTreinos
};
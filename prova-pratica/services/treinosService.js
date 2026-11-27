
const repository = require('../repositories/treinosRepository.js');

function validarTreino(corpo) {
    if (!corpo || typeof corpo.nome !== 'string' || corpo.nome.trim() === '') {
        return 'O campo nome e obrigatorio e deve ser um texto.';
    }

    if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0 || !Number.isFinite(corpo.duracao)) {
        return 'O campo duracao e obrigatorio e deve ser um numero maior que zero.';
    }

    if (corpo.duracao > 180) {
        return 'A duracao maxima de um treino e 180 minutos.';
    }

    return null;
}

// Valida IDs: somente números inteiros positivos, sem letras ou símbolos.
function idValido(texto) {
    if (typeof texto !== 'string' || !/^[1-9]\d*$/.test(texto)) {
        return false;
    }

    const n = Number(texto);

    return Number.isSafeInteger(n);
}

// Converte o SQLite (0 ou 1) para boolean.
function comoTreino(linha) {
    if (linha === undefined || linha === null) {
        return undefined;
    }

    return {
        ...linha,
        concluido: linha.concluido === 1
    };
}

function listarTodos() {
    return repository.listarTodos().map(comoTreino);
}

function buscarPorId(id) {
    return comoTreino(repository.buscarPorId(id));
}

function criarTreino(corpo) {
    const erro = validarTreino(corpo);

    if (erro !== null) {
        return { erro };
    }

    const novo = repository.criar(
        corpo.nome.trim(),
        corpo.duracao
    );

    return { treino: comoTreino(novo) };
}

function atualizarTreino(id, corpo) {
    const existente = repository.buscarPorId(id);

    if (existente === undefined) {
        return { naoEncontrado: true };
    }

    const erro = validarTreino(corpo);

    if (erro !== null) {
        return { erro };
    }

    const atualizado = repository.atualizar(
        id,
        corpo.nome.trim(),
        corpo.duracao
    );

    return { treino: comoTreino(atualizado) };
}

function removerTreino(id) {
    const existente = repository.buscarPorId(id);

    if (existente === undefined) {
        return { naoEncontrado: true };
    }

    repository.remover(id);

    return { removido: true };
}

function concluirTreino(id) {
    const existente = repository.buscarPorId(id);

    if (existente === undefined) {
        return { naoEncontrado: true };
    }

    const atualizado = repository.concluir(id);

    return { treino: comoTreino(atualizado) };
}

function total() {
    return repository.total();
}

module.exports = {
    validarTreino,
    idValido,
    listarTodos,
    buscarPorId,
    criarTreino,
    atualizarTreino,
    removerTreino,
    concluirTreino,
    total
};

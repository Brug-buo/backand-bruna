
const db = require('../banco.js');

// Listar todos os treinos, ordenados pela maior duração
function listarTodos() {
    return db.prepare(
        'SELECT * FROM treinos ORDER BY duracao DESC'
    ).all();
}

// Buscar um treino pelo ID
function buscarPorId(id) {
    return db.prepare(
        'SELECT * FROM treinos WHERE id = ?'
    ).get(id);
}

// Criar um novo treino
function criar(nome, duracao) {
    const resultado = db.prepare(
        'INSERT INTO treinos (nome, duracao) VALUES (?, ?)'
    ).run(nome, duracao);

    return buscarPorId(resultado.lastInsertRowid);
}

// Atualizar um treino
function atualizar(id, nome, duracao) {
    db.prepare(
        'UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?'
    ).run(nome, duracao, id);

    return buscarPorId(id);
}

// Remover um treino
function remover(id) {
    const resultado = db.prepare(
        'DELETE FROM treinos WHERE id = ?'
    ).run(id);

    return resultado.changes > 0;
}

// Contar todos os treinos
function contarTodos() {
    return db.prepare(
        'SELECT COUNT(*) AS total FROM treinos'
    ).get();
}

// Listar treinos com duração mínima
function listarPorDuracao(minimo) {
    return db.prepare(
        'SELECT * FROM treinos WHERE duracao >= ? ORDER BY duracao DESC'
    ).all(minimo);
}

// Buscar treinos pelo nome
function buscarPorNome(nome) {
    return db.prepare(
        'SELECT * FROM treinos WHERE nome LIKE ? ORDER BY duracao DESC'
    ).all(`%${nome}%`);
}

// Gerar resumo estatístico dos treinos
function resumo() {
    return db.prepare(`
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(duracao), 0) AS minutos,
            COALESCE(AVG(duracao), 0) AS media
        FROM treinos
    `).get();
}


module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    remover,
    contarTodos,
    listarPorDuracao,
    buscarPorNome,
    resumo
};
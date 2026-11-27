
const db = require('../banco.js');

// Lista todos os treinos.
function listarTodos() {
    return db
        .prepare('SELECT * FROM treinos ORDER BY id DESC')
        .all();
}

// Busca um treino pelo ID.
function buscarPorId(id) {
    return db
        .prepare('SELECT * FROM treinos WHERE id = ?')
        .get(id);
}

// Cria um treino.
function criar(nome, duracao) {
    const resultado = db
        .prepare(`
            INSERT INTO treinos (nome, duracao)
            VALUES (?, ?)
        `)
        .run(nome, duracao);

    return buscarPorId(Number(resultado.lastInsertRowid));
}

// Atualiza um treino.
function atualizar(id, nome, duracao) {
    db.prepare(`
        UPDATE treinos
        SET nome = ?, duracao = ?
        WHERE id = ?
    `).run(nome, duracao, id);

    return buscarPorId(id);
}

// Remove um treino.
function remover(id) {
    const resultado = db
        .prepare('DELETE FROM treinos WHERE id = ?')
        .run(id);

    return resultado.changes > 0;
}

// Conclui um treino.
function concluir(id) {
    db.prepare(`
        UPDATE treinos
        SET concluido = 1
        WHERE id = ?
    `).run(id);

    return buscarPorId(id);
}

// Retorna a quantidade total de treinos.
function total() {
    const resultado = db
        .prepare('SELECT COUNT(*) AS total FROM treinos')
        .get();

    return resultado.total;
}

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    remover,
    concluir,
    total
};

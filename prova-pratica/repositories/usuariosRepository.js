
const db = require('../banco.js');

// Busca usuario com hash: uso interno da autenticacao.
function buscarPorUsuario(usuario) {
    return db
        .prepare(`
            SELECT id, usuario, senha_hash
            FROM usuarios
            WHERE usuario = ?
        `)
        .get(usuario);
}

// Busca publica: nunca retorna senha ou hash.
function buscarPorId(id) {
    return db
        .prepare(`
            SELECT id, usuario
            FROM usuarios
            WHERE id = ?
        `)
        .get(id);
}

// Insere usuario com senha criptografada.
function inserir(usuario, senhaHash) {
    const resultado = db
        .prepare(`
            INSERT INTO usuarios (usuario, senha_hash)
            VALUES (?, ?)
        `)
        .run(usuario.trim(), senhaHash);

    return Number(resultado.lastInsertRowid);
}

module.exports = {
    buscarPorUsuario,
    buscarPorId,
    inserir
};


const bcrypt = require('bcrypt');
const repository = require('../repositories/usuariosRepository.js');

async function login(usuario, senha) {
    if (
        typeof usuario !== 'string' ||
        typeof senha !== 'string' ||
        usuario.trim() === '' ||
        senha === ''
    ) {
        return { invalido: true };
    }

    const encontrado = repository.buscarPorUsuario(usuario.trim());

    if (!encontrado || !encontrado.senha_hash) {
        return { invalido: true };
    }

    const confere = await bcrypt.compare(
        senha,
        encontrado.senha_hash
    );

    if (!confere) {
        return { invalido: true };
    }

    return {
        usuario: {
            id: encontrado.id,
            usuario: encontrado.usuario
        }
    };
}

// CADASTRO
async function cadastrar(usuario, senha) {
    if (typeof usuario !== 'string' || usuario.trim() === '') {
        return { erro: 'Usuario obrigatorio.' };
    }

    if (typeof senha !== 'string' || senha.length < 4) {
        return {
            erro: 'A senha precisa ter 4 ou mais caracteres.'
        };
    }

    usuario = usuario.trim();

    // Verifica se o usuario ja existe
    if (repository.buscarPorUsuario(usuario) !== undefined) {
        return { existe: true };
    }

    // Gera o hash da senha
    const hash = await bcrypt.hash(senha, 10);

    // Insere no banco
    const id = repository.inserir(usuario, hash);

    return {
        usuario: {
            id,
            usuario
        }
    };
}

module.exports = {
    login,
    cadastrar
};

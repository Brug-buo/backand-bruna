
const service = require('../services/authService.js');
const sessoes = require('../sessoes.js');
const usuariosRepository = require('../repositories/usuariosRepository.js');

function lerCookie(req, nome) {
    const cabecalho = req.headers.cookie;

    if (!cabecalho) return null;

    const pares = cabecalho.split(';');

    for (const par of pares) {
        const partes = par.trim().split('=');
        const chave = partes.shift();
        const valor = partes.join('=');

        if (chave === nome) return valor;
    }

    return null;
}

function textoDe(valor) {
    return typeof valor === 'string' ? valor : '';
}

// LOGIN
async function login(req, res) {
    try {
        const usuario = textoDe(req.body?.usuario).trim();
        const senha = textoDe(req.body?.senha);

        if (!usuario || !senha) {
            return res.status(401).json({
                erro: 'Usuario ou senha invalidos.'
            });
        }

        const resultado = await service.login(usuario, senha);

        if (!resultado || resultado.invalido === true) {
            return res.status(401).json({
                erro: 'Usuario ou senha invalidos.'
            });
        }

        const token = sessoes.criar(resultado.usuario.id);

        res.cookie('sid', token, {
            httpOnly: true,
            sameSite: 'lax'
        });

        return res.status(200).json(resultado.usuario);

    } catch (erro) {
        console.error('Erro no login:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao realizar login.'
        });
    }
}

// CADASTRO
async function cadastro(req, res) {
    try {
        const usuario = textoDe(req.body?.usuario).trim();
        const senha = textoDe(req.body?.senha);

        if (!usuario) {
            return res.status(400).json({
                erro: 'Usuario obrigatorio.'
            });
        }

        if (senha.length < 4) {
            return res.status(400).json({
                erro: 'A senha deve ter pelo menos 4 caracteres.'
            });
        }

        const resultado = await service.cadastrar(usuario, senha);

        if (resultado.erro !== undefined) {
            return res.status(400).json({
                erro: resultado.erro
            });
        }

        if (resultado.existe === true) {
            return res.status(409).json({
                erro: 'Usuario ja existe.'
            });
        }

        return res.status(201).json(resultado.usuario);

    } catch (erro) {
        console.error('Erro no cadastro:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao realizar cadastro.'
        });
    }
}

// IDENTIFICAR USUARIO DA SESSAO
function usuarioDaRequisicao(req) {
    const token = lerCookie(req, 'sid');

    if (token === null) return null;

    const id = sessoes.usuarioIdDaSessao(token);

    if (id === undefined) return null;

    return usuariosRepository.buscarPorId(id) || null;
}

// PERFIL
function perfil(req, res) {
    const dono = usuarioDaRequisicao(req);

    if (dono === null) {
        return res.status(401).json({
            erro: 'Faca login primeiro.'
        });
    }

    return res.status(200).json(dono);
}

// LOGOUT
function logout(req, res) {
    const token = lerCookie(req, 'sid');

    if (token !== null) {
        sessoes.encerrar(token);
    }

    res.clearCookie('sid', {
        httpOnly: true,
        sameSite: 'lax'
    });

    return res.status(204).end();
}

module.exports = {
    login,
    cadastro,
    perfil,
    logout,
    usuarioDaRequisicao
};

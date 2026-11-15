
const service = require('../services/treinosService.js');
const authController = require('./authController.js');

// Listar todos os treinos
function listar(req, res) {
    res.status(200).json(service.listarTodos());
}

// Buscar treino pelo ID
function buscarUm(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID invalido.' });
    }

    const treino = service.buscarPorId(id);

    if (treino === undefined) {
        return res.status(404).json({
            erro: 'Treino nao encontrado.'
        });
    }

    res.status(200).json(treino);
}

// Criar treino
function criar(req, res) {
    const usuarioLogado = authController.usuarioDaRequisicao(req);

    if (usuarioLogado === null) {
        return res.status(401).json({
            erro: 'Faca login primeiro.'
        });
    }

    const resultado = service.criarTreino(req.body);

    if (resultado.erro !== undefined) {
        return res.status(400).json({
            erro: resultado.erro
        });
    }

    res.status(201).json(resultado.treino);
}

// Atualizar treino
function atualizar(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID invalido.' });
    }

    const resultado = service.atualizarTreino(id, req.body);

    if (resultado.naoEncontrado === true) {
        return res.status(404).json({
            erro: 'Treino nao encontrado.'
        });
    }

    if (resultado.erro !== undefined) {
        return res.status(400).json({
            erro: resultado.erro
        });
    }

    res.status(200).json(resultado.treino);
}

// Remover treino
function remover(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: 'ID invalido.' });
    }

    const resultado = service.removerTreino(id);

    if (resultado.naoEncontrado === true) {
        return res.status(404).json({
            erro: 'Treino nao encontrado.'
        });
    }

    res.status(204).end();
}

// Contar todos os treinos
function contar(req, res) {
    res.status(200).json(service.contarTreinos());
}

// Listar, filtrar por duração ou buscar pelo nome
function listarPorDuracao(req, res) {

    // Buscar pelo nome
    if (req.query.busca !== undefined) {

        if (typeof req.query.busca !== 'string') {
            return res.status(400).json({
                erro: 'A busca deve ser um texto.'
            });
        }

        const busca = req.query.busca.trim();

        if (busca === '') {
            return res.status(400).json({
                erro: 'Informe um nome para a busca.'
            });
        }

        return res.status(200).json(
            service.buscarPorNome(busca)
        );
    }

    // Listar todos quando não houver filtro
    if (req.query.minimo === undefined) {
        return res.status(200).json(service.listarTodos());
    }

    // Filtrar por duração mínima
    const minimo = Number(req.query.minimo);

    if (!Number.isFinite(minimo) || minimo < 0) {
        return res.status(400).json({
            erro: 'O minimo deve ser um numero maior ou igual a zero.'
        });
    }

    res.status(200).json(
        service.listarPorDuracao(minimo)
    );
}

// Exibir resumo estatístico
function resumo(req, res) {
    res.status(200).json(service.resumoTreinos());
}

module.exports = {
    listar,
    buscarUm,
    criar,
    atualizar,
    remover,
    contar,
    listarPorDuracao,
    resumo
};

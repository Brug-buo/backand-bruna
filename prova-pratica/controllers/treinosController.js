
const service = require('../services/treinosService.js');
const { usuarioDaRequisicao } = require('./authController.js');

function listar(req, res) {
    const treinos = service.listarTodos();
    return res.status(200).json(treinos);
}

// CARD E
function total(req, res) {
    return res.status(200).json({
        total: service.total()
    });
}

// BUSCAR TREINO
function buscarUm(req, res) {
    if (!service.idValido(req.params.id)) {
        return res.status(400).json({
            erro: 'Id invalido.'
        });
    }

    const id = Number(req.params.id);
    const treino = service.buscarPorId(id);

    if (treino === undefined) {
        return res.status(404).json({
            erro: 'Treino nao encontrado.'
        });
    }

    return res.status(200).json(treino);
}

// CRIAR TREINO
function criar(req, res) {
    if (usuarioDaRequisicao(req) === null) {
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

    return res.status(201).json(resultado.treino);
}

// ATUALIZAR TREINO
function atualizar(req, res) {
    if (usuarioDaRequisicao(req) === null) {
        return res.status(401).json({
            erro: 'Faca login primeiro.'
        });
    }

    if (!service.idValido(req.params.id)) {
        return res.status(400).json({
            erro: 'Id invalido.'
        });
    }

    const id = Number(req.params.id);
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

    return res.status(200).json(resultado.treino);
}

// EXCLUIR TREINO
function remover(req, res) {
    if (usuarioDaRequisicao(req) === null) {
        return res.status(401).json({
            erro: 'Faca login primeiro.'
        });
    }

    if (!service.idValido(req.params.id)) {
        return res.status(400).json({
            erro: 'Id invalido.'
        });
    }

    const id = Number(req.params.id);
    const resultado = service.removerTreino(id);

    if (resultado.naoEncontrado === true) {
        return res.status(404).json({
            erro: 'Treino nao encontrado.'
        });
    }

    return res.status(204).end();
}

// CONCLUIR TREINO - CARD D
function concluir(req, res) {
    if (!service.idValido(req.params.id)) {
        return res.status(400).json({
            erro: 'Id invalido.'
        });
    }

    const id = Number(req.params.id);
    const resultado = service.concluirTreino(id);

    if (resultado.naoEncontrado === true) {
        return res.status(404).json({
            erro: 'Treino nao encontrado.'
        });
    }

    if (usuarioDaRequisicao(req) === null) {
        return res.status(401).json({
            erro: 'Faca login primeiro.'
        });
    }

    return res.status(200).json(resultado.treino);
}

module.exports = {
    listar,
    total,
    buscarUm,
    criar,
    atualizar,
    remover,
    concluir
};

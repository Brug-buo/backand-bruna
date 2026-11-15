const express = require('express');
const bcrypt = require('bcrypt');

const db = require('./banco.js');
const treinosController = require('./controllers/treinosController.js');
const authController = require('./controllers/authController.js');

const app = express();

app.use(express.json());

async function prepararUsuariosDeTeste() {
    const resultado = db.prepare(
        'SELECT COUNT(*) AS total FROM usuarios'
    ).get();

    if (resultado.total === 0) {
        const senhaDiego = await bcrypt.hash('1234', 10);
        const senhaAluno = await bcrypt.hash('senha', 10);

        const inserir = db.prepare(
            'INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)'
        );

        inserir.run('diego', senhaDiego);
        inserir.run('aluno', senhaAluno);

        console.log('Usuarios de teste criados.');
    }
}

// Rotas de treinos
app.get('/treinos/total', treinosController.contar);
app.get('/treinos/resumo', treinosController.resumo);
app.get('/treinos', treinosController.listarPorDuracao);
app.get('/treinos/:id', treinosController.buscarUm);

app.post('/treinos', authController.usuarioDaRequisicao, treinosController.criar);
app.put('/treinos/:id', treinosController.atualizar);
app.delete('/treinos/:id', treinosController.remover);

// Rotas de autenticacao
app.post('/login', authController.login);
app.get('/perfil', authController.perfil);
app.post('/logout', authController.logout);

const PORTA = 3000;

prepararUsuariosDeTeste()
    .then(() => {
        app.listen(PORTA, () => {
            console.log(`Servidor rodando em http://localhost:${PORTA}`);
        });
    })
    .catch((erro) => {
        console.error('Erro ao preparar usuarios:', erro);
        process.exitCode = 1;
    });

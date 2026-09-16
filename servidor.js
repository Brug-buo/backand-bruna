
// API do Diario de Treinos
// Back-End I - CEEP Pedro Boaretto Neto
// ============================================================
// Este arquivo esta quase vazio DE PROPOSITO.
// Hoje voce vai escrever as rotas, uma de cada vez, conferindo
// no testes.http se cada uma responde o status certo.
// O que cada rota deve fazer esta no README.md.
// ============================================================

const express = require('express');
const app = express();

// Faz o Express entender JSON no corpo das requisicoes
app.use(express.json());





// Aula 02
const treinos = [
    {id: 1, nome: 'Treino A',  duracao: 60}, 
    {id: 2, nome: 'Treino B',  duracao: 45},
    {id: 3, nome: 'Treino C',  duracao: 50},
    {id: 4, nome: 'Treino D',  duracao: 55}
];
let proximoId = 5;





// Validacao
var validarTreino = (corpo) => {
    // [PROF] corpo.nome == ' ' so pega quando o nome eh exatamente um espaco. Pensa num jeito de pegar o nome vazio tambem.
    if (typeof corpo.nome !== 'string' || corpo.nome == ' '){
        return ("O campo nome é obrigatório!");
    }
    // [PROF] Com < 0 a duracao 0 passa. O README pede maior que zero.
    if (typeof corpo.duracao !== 'number' || corpo.duracao < 0) {
        return ("O campo duracção é obrigatório é maior que zero!");
    }
    return null;
};





// GET /treinos
app.get('/treinos', (req, res) => {
    res.status(200).json(treinos);
});





// GET /treinos/:id 
app.get('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);
    const treino = treinos.find((t) => t.id === id);

    if (treino === undefined){
        // [PROF] O README pede o campo erro, nao error. Esse eh o unico teste que falta pra voce.
        return res.status(404).json({ error: 'Treino não encontrado' });
    }

    res.status(200).json(treino);
});





// POST /treinos  
app.post('/treinos', (req, res) => {
    const erro = validarTreino(req.body);
if (erro !== null){
    // [PROF] Aqui tambem: erro, nao error.
    return res.status(400).json({ error: erro });
}
const treino ={id: proximoId,
    nome:req.body.nome,
    duracao:req.body.duracao,
};
    proximoId= proximoId + 1;
treinos.push(treino);
res.status(201).json(treino);
});





// PUT /treinos/:id
app.put('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);
    const treino = treinos.find((t) => t.id === id);
    if (treino === undefined){
        // [PROF] Faltou o return. Sem ele o codigo continua descendo e tenta responder duas vezes.
        res.status(404).json({erro: "não encontrado"});
    }
    const erro = validarTreino(req.body);
    if (erro !== null){
        // [PROF] Mesma coisa: faltou o return.
        res.status(400).json({erro: erro});
    }
    treino.nome = req.body.nome;
    treino.duracao = req.body.duracao;
    res.status(200).json(treino);
});





// DELETE /treinos/:id
app.delete('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = treinos.findIndex((t) => t.id === id);
    if (indice === -1) {
        return res.status(404).json({ erro: "Treino não encontrado" });
    }
    treinos.splice(indice, 1);
    res.status(204).end();
});



// ------------------------------------------------------------
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

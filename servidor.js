// ============================================================
// API do Diário de Treinos
// Back-End I - CEEP Pedro Boaretto Neto
// ============================================================

const express = require('express');
const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(express.json());



// Configuração do Banco de Dados
const db = new DatabaseSync('treinos.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    duracao INTEGER NOT NULL
  )
`);



// DADOS INICIAIS DE TESTE
const checarVazia = db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
if (checarVazia.total === 0) {
  const inserir = db.prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)');
  inserir.run('Peito e triceps', 90);
  inserir.run('Costas e biceps', 12);
  console.log('👉 Banco de dados inicializado com treinos de teste!');
}



// Função Auxiliar de Validação
function validarTreino(corpo) {
  if (typeof corpo.nome !== 'string' || corpo.nome.trim() === '') {
    return 'O campo nome é obrigatório e deve ser um texto.';
  }
  if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
    return 'O campo duração é obrigatório e deve ser um número maior que zero.';
  }
  return null;
}



// GET /treinos/total
app.get('/treinos/total', (req, res) => {
  const resultado = db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
  res.status(200).json(resultado);
});



// GET /treinos/resumo
app.get('/treinos/resumo', (req, res) => {
  const resumo = db.prepare('SELECT COUNT(*) AS total, SUM(duracao) AS minutos, AVG(duracao) AS media FROM treinos').get();
  
  res.status(200).json({
    total: resumo.total || 0,
    minutos: resumo.minutos || 0,
    media: resumo.media || 0
  });
});



// GET /treinos - Listagem com Filtros
app.get('/treinos', (req, res) => {
  const { minimo, busca } = req.query;
  let sql = 'SELECT * FROM treinos WHERE 1=1';
  const params = [];

  if (minimo) {
    sql += ' AND duracao >= ?';
    params.push(Number(minimo));
  }
  if (busca) {
    sql += ' AND nome LIKE ?';
    params.push(`%${busca}%`);
  }
  sql += ' ORDER BY duracao DESC';

  const stmt = db.prepare(sql);
  const treinosFiltrados = params.length > 0 ? stmt.all(...params) : stmt.all();

  res.status(200).json(treinosFiltrados);
});



// POST /treinos - Criação de um novo treino
app.post('/treinos', (req, res) => {
  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro });
  }
  const resultado = db
    .prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
    .run(req.body.nome, req.body.duracao);

  const novo = db
    .prepare('SELECT * FROM treinos WHERE id = ?')
    .get(resultado.lastInsertRowid);
  res.status(201).json(novo);
});



// GET /treinos/:id - Detalhes de um treino específico
app.get('/treinos/:id', (req, res) => {
  const idStr = req.params.id;
  const id = Number(idStr);

  if (isNaN(id) || !Number.isInteger(Number(idStr))) {
    return res.status(400).json({ erro: 'O ID deve ser um número inteiro válido.' });
  }
  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino não encontrado.' });
  }
  res.status(200).json(treino);
});



// PUT /treinos/:id - Atualização de um treino existente
app.put('/treinos/:id', (req, res) => {
  const idStr = req.params.id;
  const id = Number(idStr);

  if (isNaN(id) || !Number.isInteger(Number(idStr))) {
    return res.status(400).json({ erro: 'O ID deve ser um número inteiro válido.' });
  }
  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino não encontrado.' });
  }
  const erro = validarTreino(req.body);
  if (erro !== null) {
    return res.status(400).json({ erro });
  }
  db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
    .run(req.body.nome, req.body.duracao, id);

  const atualizado = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  res.status(200).json(atualizado);
});



// DELETE /treinos/:id - Remoção de um treino
app.delete('/treinos/:id', (req, res) => {
  const idStr = req.params.id;
  const id = Number(idStr);

  if (isNaN(id) || !Number.isInteger(Number(idStr))) {
    return res.status(400).json({ erro: 'O ID deve ser um número inteiro válido.' });
  }
  const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
  if (treino === undefined) {
    return res.status(404).json({ erro: 'Treino não encontrado.' });
  }
  db.prepare('DELETE FROM treinos WHERE id = ?').run(id);
  res.status(204).end();
});



//-------------------------------------------------------------
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

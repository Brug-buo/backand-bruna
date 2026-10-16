const service = require('./services/treinosService.js');

console.log(service.listarTodos());
console.log(service.criarTreino({ nome: 'Teste sem servidor', duracao: 15 }));
console.log(service.criarTreino({ nome: '', duracao: 15 }));

if (duracao > 180) {
  throw new Error('A duração máxima do treino é 180 minutos');
}
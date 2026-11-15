const service = require('./services/treinosService.js');

console.log('Teste 1 - Listar treinos:');
console.log(service.listarTodos());

console.log('\nTeste 2 - Criar treino válido:');
console.log(
    service.criarTreino({
        nome: 'Teste sem servidor',
        duracao: 15
    })
);

console.log('\nTeste 3 - Nome vazio:');
console.log(
    service.criarTreino({
        nome: '',
        duracao: 15
    })
);

console.log('\nTeste 4 - Duração acima de 180 minutos:');
console.log(
    service.criarTreino({
        nome: 'Treino longo',
        duracao: 181
    })
);

console.log('\nTeste 5 - Duração de 180 minutos:');
console.log(
    service.criarTreino({
        nome: 'Treino no limite',
        duracao: 180
    })
);

console.log('\nTestes do service finalizados.');
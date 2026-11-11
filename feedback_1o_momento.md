Bruna, seu repositório fechou em 2,1 de 2,5. Na aula 2, a API completa passou nos 10 testes já no commit d80068f, de 17/09. Na aula 3, a migração para SQLite passou nos 7 testes e nos três exercícios no commit 037b1b7, de 25/09, e os três opcionais (busca, resumo e id inválido) também funcionaram, o que somou +0,1 na nota.

Na aula 4, os 8 testes de estrutura e de API passaram no commit 9b7f206, de 16/10. O que faltou foi a regra dos 180 minutos, que devia estar dentro de `validarTreino`, no `treinosService.js`. No commit 405b784, de 16/10 às 11:14, você escreveu `if (duracao > 180)` dentro do `teste-service.js`, onde a variável `duracao` não existe. Por isso a regra não vale para a API, e `node teste-service.js` agora termina com `ReferenceError: duracao is not defined`. Esse erro continua no repositório.

Na aula 5, login, perfil, logout, cookie, duas sessões separadas e a rota de treino protegida passaram nos 8 testes, no commit 475614f, de 30/10. Como a rota de treino agora exige login, os testes da aula 4 que não mandam cookie recebem 401, e isso é esperado, não tirou nota.

A aula 6 não foi entregue. O `authService.js` ainda compara a senha em texto puro (`encontrado.senha !== senha`), não há `bcrypt` no `package.json` nem `criarUsuarios.js`, e a tabela de usuários guarda a senha sem hash. Por isso essa aula não pontuou. Para recuperar, o caminho é instalar o `bcrypt`, gerar o hash no `criarUsuarios.js` e trocar a comparação por `await bcrypt.compare`.

Se tiver dúvida, fala na próxima aula.

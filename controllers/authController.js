
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

function login(req, res) {
  const usuarioRecebido = req.body?.usuario;
  const senhaRecebida = req.body?.senha;

  if (
    typeof usuarioRecebido !== 'string' ||
    typeof senhaRecebida !== 'string'
  ) {
    return res.status(401).json({
      erro: 'Usuario ou senha invalidos.'
    });
  }

  const usuario = usuarioRecebido.trim();
  const senha = senhaRecebida;

  const resultado = service.login(usuario, senha);

  if (resultado.invalido === true) {
    return res.status(401).json({
      erro: 'Usuario ou senha invalidos.'
    });
  }

  const token = sessoes.criar(resultado.usuario.id);

  res.cookie('sid', token, { httpOnly: true });

  res.status(200).json(resultado.usuario);
}

function usuarioDaRequisicao(req, res, next) {
  const token = lerCookie(req, 'sid');

  if (token === null) {
    return res.status(401).json({
      erro: 'Faca login primeiro.'
    });
  }

  const id = sessoes.usuarioIdDaSessao(token);

  if (id === undefined) {
    return res.status(401).json({
      erro: 'Faca login primeiro.'
    });
  }

  const usuario = usuariosRepository.buscarPorId(id);

  if (!usuario) {
    return res.status(401).json({
      erro: 'Faca login primeiro.'
    });
  }

  req.usuario = usuario;

  next();
}

function perfil(req, res) {
  const token = lerCookie(req, 'sid');

  if (token === null) {
    return res.status(401).json({
      erro: 'Faca login primeiro.'
    });
  }

  const id = sessoes.usuarioIdDaSessao(token);

  if (id === undefined) {
    return res.status(401).json({
      erro: 'Faca login primeiro.'
    });
  }

  const dono = usuariosRepository.buscarPorId(id);

  if (!dono) {
    return res.status(401).json({
      erro: 'Faca login primeiro.'
    });
  }

  res.status(200).json(dono);
}

function logout(req, res) {
  const token = lerCookie(req, 'sid');

  if (token !== null) {
    sessoes.encerrar(token);
  }

  res.clearCookie('sid');
  res.status(204).end();
}

module.exports = {
  login,
  perfil,
  logout,
  usuarioDaRequisicao
};

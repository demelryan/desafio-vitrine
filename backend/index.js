const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const DATA_FILE = './database.json';
const JWT_SECRET = 'sua_chave_secreta_aqui';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const lerBanco = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { usuarios: [], anuncios: [], carrinho: [] };
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return {
      usuarios: parsed.usuarios || [],
      anuncios: parsed.anuncios || [],
      carrinho: parsed.carrinho || []
    };
  } catch (err) {
    return { usuarios: [], anuncios: [], carrinho: [] };
  }
};

const salvarBanco = (dados) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dados, null, 2));
  } catch (err) {
    console.error("Erro ao salvar:", err);
  }
};

const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ mensagem: "Acesso negado!" });

  try {
    const decodificado = jwt.verify(token, JWT_SECRET);
    req.usuarioLogado = decodificado;
    next();
  } catch (err) {
    res.status(401).json({ mensagem: "Token inválido!" });
  }
};
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  const db = lerBanco();
  
  if (db.usuarios.find(u => u.email === email)) {
    return res.status(400).json({ mensagem: "E-mail já existe!" });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const novoUsuario = { id: Date.now(), nome, email, senha: senhaCriptografada };
  
  db.usuarios.push(novoUsuario);
  salvarBanco(db);
  res.status(201).json({ mensagem: "Conta criada!", usuario: { nome } });
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const db = lerBanco();
  const usuario = db.usuarios.find(u => u.email === email);

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).json({ mensagem: "Incorretos!" });
  }

  const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, nome: usuario.nome });
});
app.get('/produtos', (req, res) => res.json(lerBanco().anuncios));

app.post('/produtos', autenticar, (req, res) => {
  const db = lerBanco();
  const novo = { 
    id: Date.now(), 
    ...req.body, 
    vendedor: req.usuarioLogado.nome,
    vendedorId: req.usuarioLogado.id 
  };
  db.anuncios.push(novo);
  salvarBanco(db);
  res.status(201).json(novo);
});

app.put('/produtos/:id', autenticar, (req, res) => {
  const { id } = req.params;
  const db = lerBanco();
  const index = db.anuncios.findIndex(p => String(p.id) === String(id));
  
  if (index === -1) return res.status(404).json({ mensagem: "Produto não encontrado!" });

  if (db.anuncios[index].vendedorId !== req.usuarioLogado.id) {
    return res.status(403).json({ mensagem: "Você não tem permissão para editar este produto!" });
  }
  
  db.anuncios[index] = { ...db.anuncios[index], ...req.body, vendedorId: req.usuarioLogado.id };
  salvarBanco(db);
  res.json(db.anuncios[index]);
});

app.delete('/produtos/:id', autenticar, (req, res) => {
  const { id } = req.params;
  const db = lerBanco();
  const produto = db.anuncios.find(p => String(p.id) === String(id));

  if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado!" });

  if (produto.vendedorId !== req.usuarioLogado.id) {
    return res.status(403).json({ mensagem: "Você não tem permissão para excluir este produto!" });
  }

  db.anuncios = db.anuncios.filter(p => String(p.id) !== String(id));
  salvarBanco(db);
  res.json({ mensagem: "Removido!" });
});


app.get('/carrinho', autenticar, (req, res) => {
  const db = lerBanco();
  const lista = db.carrinho.filter(i => i.usuarioId === req.usuarioLogado.id);
  res.json(lista);
});

app.post('/carrinho', autenticar, (req, res) => {
  const db = lerBanco();
  const { produtoId, quantidade } = req.body;
  const usuarioId = req.usuarioLogado.id;

  const itemExistente = db.carrinho.find(i => i.produtoId === produtoId && i.usuarioId === usuarioId);

  if (itemExistente) {
    itemExistente.quantidade = (itemExistente.quantidade || 1) + (quantidade || 1);
    salvarBanco(db);
    return res.json(itemExistente);
  }

  const novoItem = { 
    id: Date.now(), 
    produtoId, 
    quantidade: quantidade || 1, 
    usuarioId 
  };
  
  db.carrinho.push(novoItem);
  salvarBanco(db);
  res.status(201).json(novoItem);
});

app.put('/carrinho/:id', autenticar, (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;
  const db = lerBanco();
  
  const item = db.carrinho.find(i => String(i.id) === String(id) && i.usuarioId === req.usuarioLogado.id);
  
  if (item) {
    item.quantidade = quantidade;
    salvarBanco(db);
    res.json(item);
  } else {
    res.status(404).json({ mensagem: "Item não encontrado no seu carrinho!" });
  }
});

app.delete('/carrinho/:id', autenticar, (req, res) => {
  const { id } = req.params;
  const db = lerBanco();
  
  const novoCarrinho = db.carrinho.filter(i => !(String(i.id) === String(id) && i.usuarioId === req.usuarioLogado.id));
  
  if (db.carrinho.length === novoCarrinho.length) {
    return res.status(404).json({ mensagem: "Item não encontrado ou acesso negado!" });
  }

  db.carrinho = novoCarrinho;
  salvarBanco(db);
  res.json({ mensagem: "Removido!" });
});

app.delete('/carrinho/limpar/vaziar', autenticar, (req, res) => {
  const db = lerBanco();
  db.carrinho = db.carrinho.filter(i => i.usuarioId !== req.usuarioLogado.id);
  salvarBanco(db);
  res.json({ mensagem: "Seu carrinho foi limpo!" });
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Servidor Online - Porta 3000");
});

🛒 Vitrine 
Este projeto é uma plataforma de vitrine de produtos onde usuários podem se cadastrar, anunciar itens, gerenciar seus próprios produtos e utilizar um carrinho de compras individual.

🛠️ Tecnologias Utilizadas
 * Frontend: React, TypeScript, Vite.
 * Backend: Node.js, Express.
 * Autenticação: JSON Web Token (JWT) e Bcrypt.js para criptografia de senhas.
 * Banco de Dados: Arquivo JSON local (database.json) para persistência de dados.
 
🔒 Implementações de Segurança
 * Autenticação por Token: Apenas usuários logados podem anunciar ou comprar.
 * Proteção contra IDOR: O carrinho de compras é vinculado ao ID do usuário via token, impedindo que um usuário acesse o carrinho de outro.
 * Controle de Propriedade: Um usuário só pode editar ou excluir anúncios que ele mesmo criou, verificado através do vendedorId no servidor.
 
🚀 Como Executar o Projeto

1. Configurar o Backend
Abra o terminal na pasta raiz do projeto:
cd backend
npm install
node index.js

O servidor iniciará na porta 3000.

2. Configurar o Frontend
Abra um novo terminal na pasta raiz:
cd frontend
npm install
npm run dev

O Vite fornecerá um link (geralmente http://localhost:5173) para acessar a aplicação.

📂 Estrutura de Pastas
 * /backend: Contém o servidor Express e o banco de dados JSON.
 * /frontend/src/hooks: Lógica de comunicação com a API (Carrinho e Produtos).
 * /frontend/src/pages: Interfaces da aplicação (Vitrine, Meus Produtos, Carrinho).

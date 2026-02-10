🛒 Vitrine (Django + React)

Este projeto é uma plataforma completa de vitrine, onde usuários podem se cadastrar, anunciar itens com múltiplas imagens, gerenciar seus anúncios e interagir com um carrinho de compras em tempo real.

🛠️ Tecnologias Utilizadas

 * Frontend: React, TypeScript, Vite, React Router DOM.
 * Backend: Python, Django, Django Rest Framework (DRF).
 * Autenticação: JWT (JSON Web Token) via SimpleJWT.
 * Banco de Dados: SQLite (Desenvolvimento) com suporte a arquivos de mídia (Imagens).
 
🔒 Implementações de Segurança

 * Autenticação JWT: Login seguro que retorna access e refresh tokens, vinculando a identidade do usuário a cada requisição.
 * Custom Token Claims: Backend personalizado para retornar user_id, username e first_name diretamente no payload do token.
 * Controle de Propriedade (Owner-Only): * No Frontend, o botão "Tenho Interesse" é substituído por "Editar Meu Anúncio" se o usuário logado for o dono.
   * No Backend, permissões de classe e sobrescrita de métodos garantem que apenas o criador possa modificar seus itens.
 * Gestão de Mídia: Upload seguro de imagens via MultiPartParser, com suporte a imagem principal e galeria adicional.
 
🚀 Como Executar o Projeto

1. Configurar o Backend (Django)

Abra o terminal na pasta do servidor:

cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow
python manage.py migrate
python manage.py runserver

O servidor iniciará em http://127.0.0.1:8000.

2. Configurar o Frontend (React + Vite)

Abra um novo terminal na pasta do frontend:

cd frontend
npm install
npm run dev

Acesse o link fornecido (geralmente http://localhost:5173).

📂 Estrutura de Pastas

 * /backend: Contém todo o ecossistema Django (Configurações, API, Banco de Dados e Mídias).
 * /frontend: Contém a aplicação React, incluindo componentes, hooks de comunicação, páginas de interface e utilitários de sistema.

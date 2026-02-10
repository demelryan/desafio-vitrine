import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { useProdutos } from './hooks/useProdutos';
import { useCarrinho } from './hooks/useCarrinho';
import { Vitrine, Anunciar, MeusProdutos, Produtos, EditarAnuncio, Carrinho, ResultadoBusca } from './pages';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario');
    if (!salvo) return null;
    try {
      return JSON.parse(salvo);
    } catch {
      return salvo;
    }
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: '' });
  
  const { anuncios, adicionarAnuncio, editarAnuncioNoServidor, excluirAnuncioNoServidor } = useProdutos();
  
  const { itens, adicionarItem, esvaziar, removerItem, alterarQuantidade } = useCarrinho(usuario);

  const aviso = (msg: string, tipo: 'sucesso' | 'erro') => {
    setToast({ visivel: true, mensagem: msg, tipo });
    setTimeout(() => setToast({ visivel: false, mensagem: '', tipo: '' }), 3000);
  };

  useEffect(() => {
    const salvo = localStorage.getItem('usuario');
    if (salvo && !usuario) {
        try { setUsuario(JSON.parse(salvo)); } catch { setUsuario(salvo); }
    }
  }, []);

  return (
    <div className="layout-site">
      <Header 
        usuario={usuario} 
        carrinhoCount={itens.length}
        setModalAberto={setModalAberto} 
        fazerLogout={() => { 
          localStorage.removeItem('usuario'); 
          localStorage.removeItem('token'); 
          setUsuario(null); 
          navigate('/'); 
        }} 
      />

      <main className="conteudo-principal">
        <Routes>
          {/* Vitrine / Home */}
          <Route path="/" element={<Vitrine anuncios={anuncios} />} />
          
          {/* Anunciar Novo Produto */}
          <Route path="/enviar" element={
            usuario ? <Anunciar adicionarAnuncio={adicionarAnuncio} mostrarAviso={aviso} /> : <Navigate to="/" />
          } />

          {/* Gestão de Produtos do Vendedor */}
          <Route path="/meus-produtos" element={
            usuario ? <MeusProdutos anuncios={anuncios} /> : <Navigate to="/" />
          } />

          {/* Página Detalhada do Produto */}
          <Route path="/produto/:id" element={
            <Produtos 
              anuncios={anuncios} 
              abrirModal={setModalAberto} 
              adicionarAoCarrinho={(p) => { 
                adicionarItem(p); 
                aviso("Adicionado ao carrinho! 🛒", "sucesso"); 
              }} 
            />
          } />

          {/* Editar Anúncio (Integrado com PATCH e FormData) */}
          <Route path="/editar/:id" element={
            usuario ? (
              <EditarAnuncio 
                anuncios={anuncios} 
                editarAnuncioNoServidor={editarAnuncioNoServidor} 
                excluirAnuncioNoServidor={excluirAnuncioNoServidor} 
                mostrarAviso={aviso} 
              />
            ) : <Navigate to="/" />
          } />

          {/* Carrinho de Compras */}
          <Route path="/carrinho" element={
            <Carrinho 
              itens={itens} 
              esvaziar={esvaziar} 
              mostrarAviso={aviso} 
              removerItem={removerItem} 
              alterarQuantidade={alterarQuantidade} 
            />
          } />

          {/* Resultados de Pesquisa */}
          <Route path="/busca" element={<ResultadoBusca anuncios={anuncios} />} />
        </Routes>
      </main>

      {/* Notificações flutuantes */}
      {toast.visivel && <div className={`toast-aviso ${toast.tipo}`}>{toast.mensagem}</div>}
      
      {/* Modal de Login / Registo */}
      {modalAberto && (
        <LoginModal 
          setModalAberto={setModalAberto} 
          onLoginSuccess={(dados) => {
            setUsuario(dados);
            setModalAberto(false);
          }} 
          mostrarAviso={aviso} 
        />
      )}
    </div>
  );
}

export default function App() { 
  return (
    <Router>
      <AppContent />
    </Router>
  ); 
}

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { useProdutos } from './hooks/useProdutos';
import { useCarrinho } from './hooks/useCarrinho';
import { Vitrine, Anunciar, MeusProdutos, Produtos, EditarAnuncio, Carrinho, ResultadoBusca } from './pages';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario'));
  const [modalAberto, setModalAberto] = useState(false);
  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: '' });
  
  const { anuncios, adicionarAnuncio, editarAnuncioNoServidor, excluirAnuncioNoServidor } = useProdutos();
  const { carrinho, adicionarItem, esvaziar, removerItem, alterarQuantidade } = useCarrinho(usuario);

  const aviso = (msg: string, tipo: 'sucesso' | 'erro') => {
    setToast({ visivel: true, mensagem: msg, tipo });
    setTimeout(() => setToast({ visivel: false, mensagem: '', tipo: '' }), 3000);
  };

  return (
    <div className="layout-site">
      <Header usuario={usuario} carrinhoCount={carrinho.length} setModalAberto={setModalAberto} 
        fazerLogout={() => { localStorage.removeItem('usuario'); localStorage.removeItem('token'); setUsuario(null); navigate('/'); }} />
      <main className="conteudo-principal">
        <Routes>
          <Route path="/" element={<Vitrine anuncios={anuncios} />} />
          <Route path="/enviar" element={usuario ? <Anunciar adicionarAnuncio={adicionarAnuncio} mostrarAviso={aviso} /> : <Navigate to="/" />} />
          <Route path="/meus-produtos" element={usuario ? <MeusProdutos anuncios={anuncios} setAnuncios={excluirAnuncioNoServidor} /> : <Navigate to="/" />} />
          <Route path="/produto/:id" element={<Produtos anuncios={anuncios} abrirModal={setModalAberto} adicionarAoCarrinho={(p) => { adicionarItem(p); aviso("Adicionado! 🛒", "sucesso"); }} />} />
          <Route path="/editar/:id" element={usuario ? <EditarAnuncio anuncios={anuncios} setAnuncios={editarAnuncioNoServidor} excluirAnuncioNoServidor={excluirAnuncioNoServidor} mostrarAviso={aviso} /> : <Navigate to="/" />} />
          <Route path="/carrinho" element={<Carrinho itens={carrinho} esvaziar={esvaziar} mostrarAviso={aviso} removerItem={removerItem} alterarQuantidade={alterarQuantidade} />} />
          <Route path="/busca" element={<ResultadoBusca anuncios={anuncios} />} />
        </Routes>
      </main>
      {toast.visivel && <div className={`toast-aviso ${toast.tipo}`}>{toast.mensagem}</div>}
      {modalAberto && <LoginModal setModalAberto={setModalAberto} onLoginSuccess={setUsuario} mostrarAviso={aviso} />}
    </div>
  );
}

export default function App() { return (<Router><AppContent /></Router>); }

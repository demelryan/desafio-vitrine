import { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  usuario: string | null;
  carrinhoCount: number;
  setModalAberto: (aberto: boolean) => void;
  fazerLogout: () => void;
}

export function Header({ 
  usuario, 
  carrinhoCount, 
  setModalAberto, 
  fazerLogout 
}: HeaderProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const navigate = useNavigate();

  const aoPesquisar = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && termoBusca.trim() !== '') {
      navigate(`/busca?q=${termoBusca}`);
      setTermoBusca('');
    }
  };

  const formatarNome = (nome: string | null) => {
    if (!nome) return '';
    const nomeLimpo = nome.replace(/^"(.*)"$/, '$1');
    return nomeLimpo.split(' ')[0]; 
  };

  return (
    <header className="header-principal">
      <Link to="/" className="caixa-logo">SITE</Link>
      
      <input 
        className="barra-pesquisa" 
        placeholder="O que você busca?" 
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        onKeyDown={aoPesquisar}
      />

      <div className="acoes-header">
        {usuario ? (
          <>
            <Link to="/enviar" className="btn-anunciar-header">ANUNCIAR</Link>
            <div className="perfil-container">

              <div 
                className="icone-usuario-default" 
                onClick={() => setMenuAberto(!menuAberto)}
              ></div>
              
              {menuAberto && (
                <div className="dropdown-logout">
                  <p>Olá, <strong>{formatarNome(usuario)}</strong></p>
                  
                  <Link to="/meus-produtos" className="link-dropdown" onClick={() => setMenuAberto(false)}>
                    <button className="btn-meus-produtos">
                      📦 Meus Produtos
                    </button>
                  </Link>

                  <Link to="/carrinho" className="link-dropdown" onClick={() => setMenuAberto(false)}>
                    <button className="btn-carrinho-dropdown">
                      🛒 Carrinho ({carrinhoCount})
                    </button>
                  </Link>

                  <button 
                    onClick={() => {
                      fazerLogout();
                      setMenuAberto(false);
                    }} 
                    className="btn-sair"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="caixa-login" onClick={() => setModalAberto(true)}>LOGIN</div>
        )}
      </div>
    </header>
  );
}

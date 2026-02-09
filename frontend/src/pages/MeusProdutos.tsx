import { Link } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Vitrine.css'; 

export function MeusProdutos({ anuncios }: { anuncios: any[] }) {
  const usuarioLogado = localStorage.getItem('usuario');
  const meusAnuncios = anuncios.filter(a => a.vendedor === usuarioLogado);

  return (
    <div className="meus-produtos" style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#4A0072', marginBottom: '20px' }}>
        Gerenciar Meus Anúncios
      </h2>
      
      <div className="vitrine">
        {meusAnuncios.map((item) => {
          const imagemCapa = item.imagens && item.imagens.length > 0 
            ? item.imagens[0] 
            : item.imagem;

          return (
            <Link to={`/editar/${item.id}`} key={item.id} className="card-produto" style={{ textDecoration: 'none' }}>
              <div className="foto-produto-placeholder">
                <img src={imagemCapa} alt={item.nome} />
              </div>
              <div className="info-produto">
                <h3>{item.nome}</h3>
                <p className="preco-vitrine">
                  {formatarMoeda(item.preco)}
                </p>
                <p className="cidade-vitrine">Categoria: {item.categoria || 'Geral'}</p>
                <span className="data-vitrine">Postado em: {item.data}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {meusAnuncios.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#666' }}>Você ainda não tem nenhum anúncio ativo.</p>
          <Link to="/enviar" className="btn-anunciar-header" style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'none' }}>
            Criar meu primeiro anúncio
          </Link>
        </div>
      )}
    </div>
  );
}

import { useSearchParams, Link } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Vitrine.css';

export function ResultadoBusca({ anuncios }: { anuncios: any[] }) {
  const [searchParams] = useSearchParams();
  const termoBusca = searchParams.get('q')?.toLowerCase() || "";
  const BASE_URL = 'http://127.0.0.1:8000';

  const resultados = anuncios.filter(a => 
    a.nome.toLowerCase().includes(termoBusca) || 
    (a.categoria && a.categoria.toLowerCase().includes(termoBusca)) ||
    (a.descricao && a.descricao.toLowerCase().includes(termoBusca))
  );

  const tratarUrlImagem = (item: any) => {
    const url = (item.imagens && item.imagens.length > 0) 
      ? item.imagens[0].imagem 
      : (item.imagem_url || item.imagem);

    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http')) return url;
    
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return cleanPath.startsWith('/media/') 
      ? `${BASE_URL}${cleanPath}` 
      : `${BASE_URL}/media${cleanPath}`;
  };

  return (
    <div className="meus-produtos">
      <h2 style={{ textAlign: 'center', color: '#4A0072', marginBottom: '30px' }}>
        {termoBusca ? `Resultados para: "${termoBusca}"` : "Todos os produtos"}
      </h2>
      
      {resultados.length > 0 ? (
        <div className="vitrine">
          {resultados.map((item) => (
            <Link 
              to={`/produto/${item.id}`} 
              key={item.id} 
              className="card-produto" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="foto-produto-placeholder">
                <img 
                  src={tratarUrlImagem(item)} 
                  alt={item.nome} 
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400')}
                />
              </div>
              <div className="info-produto">
                <h3>{item.nome}</h3>
                <p className="preco-vitrine">{formatarMoeda(item.preco)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                  <span className="cidade-vitrine" style={{ fontSize: '0.85rem', color: '#666' }}>
                    {item.cidade || "Brasil"}
                  </span>
                  {item.categoria && (
                    <span style={{ fontSize: '0.7rem', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.categoria}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Não encontramos nenhum resultado para <strong>"{termoBusca}"</strong>.
          </p>
          <Link to="/" style={{ 
            display: 'inline-block', 
            marginTop: '20px', 
            color: 'white', 
            backgroundColor: '#4A0072', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            textDecoration: 'none' 
          }}>
            Voltar para a Vitrine Principal
          </Link>
        </div>
      )}
    </div>
  );
}

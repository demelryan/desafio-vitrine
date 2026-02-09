import { useSearchParams, Link } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Vitrine.css';

export function ResultadoBusca({ anuncios }: { anuncios: any[] }) {
  const [searchParams] = useSearchParams();
  const termoBusca = searchParams.get('q')?.toLowerCase() || "";

  const resultados = anuncios.filter(a => 
    a.nome.toLowerCase().includes(termoBusca) || 
    (a.categoria && a.categoria.toLowerCase().includes(termoBusca))
  );

  return (
    <div className="meus-produtos">
      <h2 style={{ textAlign: 'center', color: '#4A0072' }}>
        Resultados para: "{termoBusca}"
      </h2>
      
      {resultados.length > 0 ? (
        <div className="vitrine">
          {resultados.map((item) => (
            <Link to={`/produto/${item.id}`} key={item.id} className="card-produto" style={{ textDecoration: 'none' }}>
              <div className="foto-produto-placeholder">
                <img src={item.imagens ? item.imagens[0] : item.imagem} alt={item.nome} />
              </div>
              <div className="info-produto">
                <h3>{item.nome}</h3>
                <p className="preco-vitrine">{formatarMoeda(item.preco)}</p>
                <span className="cidade-vitrine">{item.cidade}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Não encontramos nada com "{termoBusca}".</p>
          <Link to="/" style={{ color: '#7B1FA2' }}>Voltar para o início</Link>
        </div>
      )}
    </div>
  );
}

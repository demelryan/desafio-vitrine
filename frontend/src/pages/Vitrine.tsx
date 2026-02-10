import { useState, useMemo } from 'react'; 
import { Link } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Vitrine.css';

export function Vitrine({ anuncios = [] }: { anuncios: any[] }) {
  const BASE_URL = 'http://127.0.0.1:8000';

  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [cidadeAtiva, setCidadeAtiva] = useState('');
  const [faixaPreco, setFaixaPreco] = useState({ min: 0, max: 999999, label: 'Preço' });
  const [aberto, setAberto] = useState<string | null>(null);

  const categoriasFixas = ["Eletrônicos", "Roupas", "Móveis", "Esportes", "Outros"];
  
  const cidadesExistentes = useMemo(() => 
    Array.from(new Set(anuncios.map(a => a.cidade).filter(Boolean))).sort()
  , [anuncios]);

  const toggleMenu = (menu: string) => setAberto(aberto === menu ? null : menu);

  const anunciosFiltrados = anuncios.filter(a => {
    if (!a) return false;
    const valor = Number(a.preco) || 0;
    const bateCat = categoriaAtiva ? a.categoria === categoriaAtiva : true;
    const bateCid = cidadeAtiva ? a.cidade === cidadeAtiva : true;
    const batePreco = valor >= faixaPreco.min && valor <= faixaPreco.max;
    return bateCat && bateCid && batePreco;
  });

  return (
    <div className="vitrine-page">
      <div className="barra-filtros">
        <div className="filtro-container">
          <button className={`btn-filtro ${categoriaAtiva ? 'ativo' : ''}`} onClick={() => toggleMenu('cat')}>
            {categoriaAtiva || 'Categorias'} {aberto === 'cat' ? '▲' : '▼'}
          </button>
          {aberto === 'cat' && (
            <div className="filtro-dropdown">
              <p onClick={() => {setCategoriaAtiva(''); setAberto(null)}}>Todas</p>
              {categoriasFixas.map(c => (
                <p key={c} onClick={() => {setCategoriaAtiva(c); setAberto(null)}}>{c}</p>
              ))}
            </div>
          )}
        </div>

        <div className="filtro-container">
          <button className={`btn-filtro ${faixaPreco.label !== 'Preço' ? 'ativo' : ''}`} onClick={() => toggleMenu('preco')}>
            {faixaPreco.label} {aberto === 'preco' ? '▲' : '▼'}
          </button>
          {aberto === 'preco' && (
            <div className="filtro-dropdown">
              <p onClick={() => {setFaixaPreco({min:0, max:999999, label:'Preço'}); setAberto(null)}}>Qualquer</p>
              <p onClick={() => {setFaixaPreco({min:0, max:100, label:'Até 100'}); setAberto(null)}}>Até R$ 100</p>
              <p onClick={() => {setFaixaPreco({min:100, max:500, label:'100-500'}); setAberto(null)}}>R$ 100 - 500</p>
              <p onClick={() => {setFaixaPreco({min:500, max:5000, label:'500-5000'}); setAberto(null)}}>R$ 500 - 5000</p>
              <p onClick={() => {setFaixaPreco({min:5000, max:999999, label:'5000+'}); setAberto(null)}}>Acima de 5000</p>
            </div>
          )}
        </div>

        <div className="filtro-container">
          <button className={`btn-filtro ${cidadeAtiva ? 'ativo' : ''}`} onClick={() => toggleMenu('loc')}>
            {cidadeAtiva || 'Localização'} {aberto === 'loc' ? '▲' : '▼'}
          </button>
          {aberto === 'loc' && (
            <div className="filtro-dropdown">
              <p onClick={() => {setCidadeAtiva(''); setAberto(null)}}>Todas</p>
              {cidadesExistentes.map(c => (
                <p key={c} onClick={() => {setCidadeAtiva(c); setAberto(null)}}>{c}</p>
              ))}
            </div>
          )}
        </div>

        {(categoriaAtiva || cidadeAtiva || faixaPreco.label !== 'Preço') && (
          <button className="btn-limpar-filtros" onClick={() => {
            setCategoriaAtiva(''); setCidadeAtiva(''); setFaixaPreco({min:0, max:999999, label:'Preço'});
            setAberto(null);
          }}>
            Limpar ✕
          </button>
        )}
      </div>

      <div className="vitrine">
        {anunciosFiltrados.length > 0 ? (
          anunciosFiltrados.map((item) => {
            
            let imgRaw = item.imagem_url || item.imagem;
            
            if (!imgRaw && item.imagens && item.imagens.length > 0) {
              imgRaw = item.imagens[0].imagem; 
            }

            let imgFinal = "";

            if (imgRaw && typeof imgRaw === 'string') {
              if (imgRaw.startsWith('http')) {
                imgFinal = imgRaw;
              } else {
                const cleanPath = imgRaw.startsWith('/') ? imgRaw : `/${imgRaw}`;
                imgFinal = cleanPath.startsWith('/media/') 
                  ? `${BASE_URL}${cleanPath}` 
                  : `${BASE_URL}/media${cleanPath}`;
              }
            } else {
              imgFinal = 'https://via.placeholder.com/300?text=Sem+Foto';
            }

            return (
              <Link to={`/produto/${item.id}`} key={item.id} className="card-produto" style={{ textDecoration: 'none' }}>
                <div className="foto-produto-placeholder">
                  <img 
                    src={imgFinal} 
                    alt={item.nome} 
                    loading="lazy" 
                    onError={(e) => {
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = 'https://via.placeholder.com/300?text=Erro+na+Imagem';
                    }}
                  />
                </div>
                <div className="info-produto">
                  <h3>{item.nome}</h3>
                  <p className="preco-vitrine">{formatarMoeda(item.preco)}</p>
                  <p className="cidade-vitrine">{item.cidade || "Localização não informada"}</p>
                  <p style={{fontSize: '10px', color: '#999'}}>Vendido por: {item.vendedor_nome}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', width: '100%', marginTop: '50px', color: '#666' }}>
            <p>Nenhum anúncio encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

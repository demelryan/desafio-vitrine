import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Produtos.css'; 

interface ImagemGaleria {
  id: number;
  imagem: string;
}

interface Produto {
  id: number | string;
  nome: string;
  preco: number | string;
  descricao: string;
  imagem_url: string;
  imagem?: string;
  categoria?: string;
  cidade?: string;
  vendedor: number;
  vendedor_nome: string;
  imagens?: ImagemGaleria[];
}

interface ProdutosProps {
  anuncios: Produto[];
  adicionarAoCarrinho: (p: Produto) => void;
  abrirModal: (abrir: boolean) => void;
}

export function Produtos({ anuncios, adicionarAoCarrinho, abrirModal }: ProdutosProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [indexFoto, setIndexFoto] = useState(0);
  const BASE_URL = 'http://127.0.0.1:8000';

  const produto = anuncios.find(p => String(p.id) === String(id));
  
  const obterUsuarioLogado = () => {
    try {
      const usuarioRaw = localStorage.getItem('usuario');
      if (!usuarioRaw) return null;
      return JSON.parse(usuarioRaw);
    } catch (e) {
      return null;
    }
  };

  const usuarioLogado = obterUsuarioLogado();

  const ehDonoDoProduto = Boolean(
    usuarioLogado && 
    usuarioLogado.id && 
    produto && 
    String(produto.vendedor) === String(usuarioLogado.id)
  );

  if (!produto) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Produto não encontrado!</h2>
        <button onClick={() => navigate('/')} className="btn-enviar">Voltar para a Vitrine</button>
      </div>
    );
  }

  const handleBotaoPrincipal = () => {
    if (ehDonoDoProduto) {
      navigate(`/editar/${produto.id}`);
      return;
    }
    
    if (!usuarioLogado) {
      abrirModal(true);
      return;
    }

    adicionarAoCarrinho(produto);
  };

  const tratarUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http')) return url;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return cleanPath.startsWith('/media/') 
      ? `${BASE_URL}${cleanPath}` 
      : `${BASE_URL}/media${cleanPath}`;
  };

  const listaImagens: string[] = [];
  if (produto.imagem_url || produto.imagem) {
    listaImagens.push(tratarUrl(produto.imagem_url || produto.imagem || ""));
  }
  if (produto.imagens && produto.imagens.length > 0) {
    produto.imagens.forEach(imgObj => {
      listaImagens.push(tratarUrl(imgObj.imagem));
    });
  }
  if (listaImagens.length === 0) listaImagens.push('https://via.placeholder.com/400');

  return (
    <div className="container-detalhes">
      <button className="btn-voltar-link" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className="layout-detalhes">
        <div className="coluna-foto">
          <div className="carrossel-container">
            {listaImagens.length > 1 && (
              <button 
                className="seta seta-esq" 
                onClick={() => setIndexFoto((indexFoto - 1 + listaImagens.length) % listaImagens.length)}
              >
                &#10094;
              </button>
            )}

            <img 
              src={listaImagens[indexFoto]} 
              alt={produto.nome} 
              className="foto-produto-grande" 
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400')}
            />

            {listaImagens.length > 1 && (
              <button 
                className="seta seta-dir" 
                onClick={() => setIndexFoto((indexFoto + 1) % listaImagens.length)}
              >
                &#10095;
              </button>
            )}
            
            <div className="indicadores-fotos">
                {listaImagens.map((_, i) => (
                    <div 
                        key={i} 
                        className={`ponto ${i === indexFoto ? 'ativo' : ''}`}
                        onClick={() => setIndexFoto(i)}
                    />
                ))}
            </div>
          </div>
        </div>

        <div className="info-compra">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="vendedor-tag">Vendedor: {produto.vendedor_nome || "Anônimo"}</span>
            {produto.categoria && (
              <span className="vendedor-tag" style={{ backgroundColor: '#E1BEE7', color: '#4A0072' }}>
                {produto.categoria}
              </span>
            )}
          </div>
          
          <h1 className="titulo-produto">{produto.nome}</h1>
          <h2 className="preco-grande">{formatarMoeda(produto.preco)}</h2>
          
          <div className="caixa-descricao">
            <h4>Descrição:</h4>
            <p>{produto.descricao || "Sem descrição disponível."}</p>
          </div>

          <button 
            className="btn-comprar-detalhes" 
            onClick={handleBotaoPrincipal}
            style={{ 
              backgroundColor: ehDonoDoProduto ? '#4A0072' : '#007BFF', 
              color: 'white',
              cursor: 'pointer',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              width: '100%',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            {/* TEXTO DINÂMICO AQUI */}
            {ehDonoDoProduto ? 'Editar Meu Anúncio' : 'Tenho Interesse'}
          </button>
        </div>
      </div>
    </div>
  );
}

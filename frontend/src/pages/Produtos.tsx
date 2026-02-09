import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Produtos.css'; 

interface ProdutosProps {
  anuncios: any[];
  adicionarAoCarrinho: (p: any) => void;
  abrirModal: (abrir: boolean) => void;
}

export function Produtos({ anuncios, adicionarAoCarrinho, abrirModal }: ProdutosProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [indexFoto, setIndexFoto] = useState(0);

  const produto = anuncios.find(p => String(p.id) === String(id));
  
  const usuarioRaw = localStorage.getItem('usuario');
  const usuarioLogado = usuarioRaw ? usuarioRaw.replace(/"/g, '') : null;
  
  const ehDonoDoProduto = usuarioLogado === produto?.vendedor;

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

  const listaImagens = produto.imagens || [produto.imagem];

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

            <img src={listaImagens[indexFoto]} alt={produto.nome} className="foto-produto-grande" />

            {listaImagens.length > 1 && (
              <button 
                className="seta seta-dir" 
                onClick={() => setIndexFoto((indexFoto + 1) % listaImagens.length)}
              >
                &#10095;
              </button>
            )}
          </div>
        </div>

        <div className="info-compra">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="vendedor-tag">Vendedor: {produto.vendedor}</span>
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
              backgroundColor: ehDonoDoProduto ? '#007BFF' : '', 
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {ehDonoDoProduto ? "✏️ Editar meu Anúncio" : "Tenho Interesse"}
          </button>
        </div>
      </div>
    </div>
  );
}

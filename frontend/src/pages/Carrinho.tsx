import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Carrinho.css';

export function Carrinho({ itens, esvaziar, mostrarAviso, removerItem, alterarQuantidade }: any) {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [info, setInfo] = useState({ nome: '', tel: '', endereco: '' });
  const [modalLimpeza, setModalLimpeza] = useState(false);

  const total = itens.reduce((acc: number, item: any) => {
    const preco = Number(item.produto_detalhes?.preco) || 0;
    return acc + (preco * (item.quantidade || 1));
  }, 0);

  const handleLimparReal = () => {
    esvaziar();
    setModalLimpeza(false);
    mostrarAviso("Carrinho esvaziado!", "sucesso");
  };

  const finalizar = (e: React.FormEvent) => {
    e.preventDefault();
    mostrarAviso("Compra realizada com sucesso!", "sucesso");
    esvaziar();
    navigate('/');
  };

  if (itens.length === 0) {
    return (
      <div className="carrinho-vazio">
        <h2>Seu carrinho está vazio 🛒</h2>
        <button onClick={() => navigate('/')} className="btn-voltar-compras">Voltar às compras</button>
      </div>
    );
  }

  return (
    <div className="container-carrinho">
      {modalLimpeza && (
        <div className="modal-overlay">
          <div className="modal-confirmacao">
            <h3>Esvaziar carrinho?</h3>
            <p>Isso removerá todos os itens selecionados.</p>
            <div className="modal-botoes">
              <button className="btn-confirmar-limpeza" onClick={handleLimparReal}>Sim, limpar tudo</button>
              <button className="btn-cancelar-limpeza" onClick={() => setModalLimpeza(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {etapa === 1 ? (
        <>
          <div className="carrinho-header-topo">
            <h2>Meu Carrinho</h2>
            <button className="btn-limpar-texto" onClick={() => setModalLimpeza(true)}>
              Limpar Carrinho 🗑️
            </button>
          </div>

          <div className="lista-carrinho">
            {itens.map((item: any) => (
              <div key={item.id} className="item-carrinho">
                <img 
                  src={item.produto_detalhes?.imagem_url || item.produto_detalhes?.imagens?.[0]?.imagem} 
                  alt={item.produto_detalhes?.nome} 
                />
                <div className="item-info">
                  <h4>{item.produto_detalhes?.nome}</h4>
                  <p>{formatarMoeda(item.produto_detalhes?.preco)}</p>
                  <div className="controles-quantidade">
                    <button 
                      className="btn-qtd" 
                      onClick={() => alterarQuantidade(item.id, (item.quantidade || 1) - 1)} 
                      disabled={item.quantidade <= 1}
                    > - </button>
                    <span className="qtd-numero">{item.quantidade || 1}</span>
                    <button 
                      className="btn-qtd" 
                      onClick={() => alterarQuantidade(item.id, (item.quantidade || 1) + 1)}
                    > + </button>
                    <button 
                      className="btn-remover-item" 
                      onClick={() => { removerItem(item.id); mostrarAviso("Item removido", "sucesso"); }}
                    >Remover</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="resumo-carrinho">
            <h3>Total: {formatarMoeda(total)}</h3>
            <button className="btn-finalizar" onClick={() => setEtapa(2)}>Finalizar Pedido</button>
          </div>
        </>
      ) : (
        <form className="form-anuncio" onSubmit={finalizar}>
          <h2>Informações de Entrega</h2>
          <input 
            placeholder="Seu nome" 
            required 
            onChange={e => setInfo({...info, nome: e.target.value})} 
          />
          <input 
            placeholder="Telefone de contato" 
            type="tel" 
            required 
            onChange={e => setInfo({...info, tel: e.target.value})} 
          />
          <textarea 
            placeholder="Endereço completo" 
            required 
            onChange={e => setInfo({...info, endereco: e.target.value})} 
          />
          <button type="submit" className="btn-finalizar">Confirmar Compra</button>
          <button type="button" className="btn-sair" onClick={() => setEtapa(1)}>Voltar</button>
        </form>
      )}
    </div>
  );
}

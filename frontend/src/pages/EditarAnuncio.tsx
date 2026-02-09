import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Anunciar.css'; 

export function EditarAnuncio({ anuncios, setAnuncios, excluirAnuncioNoServidor, mostrarAviso }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [desc, setDesc] = useState('');
  const [imagens, setImagens] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false); 

  useEffect(() => {
    const produto = anuncios.find((p: any) => String(p.id) === String(id));
    if (produto) {
      setNome(produto.nome);
      setPreco(String(produto.preco));
      setCidade(produto.cidade);
      setCategoria(produto.categoria || '');
      setDesc(produto.descricao);
      setImagens(produto.imagens || (produto.imagem ? [produto.imagem] : []));
    }
  }, [id, anuncios]);

  const handleAdicionarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setImagens(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carregando) return;
    setCarregando(true);
    
    const precoLimpo = String(preco).replace(/\./g, '').replace(',', '.');
    const precoNumerico = Number(precoLimpo);

    const anuncioAtualizado = { 
      nome, 
      preco: isNaN(precoNumerico) ? 0 : precoNumerico, 
      cidade, 
      categoria, 
      descricao: desc, 
      imagens 
    };

    try {
      await setAnuncios(id, anuncioAtualizado);
      mostrarAviso("Produto atualizado!", "sucesso");
      setTimeout(() => {
        navigate('/meus-produtos');
      }, 300);
    } catch (error) {
      mostrarAviso("Erro ao atualizar.", "erro");
      setCarregando(false);
    }
  };

  const handleExcluirConfirmado = async () => {
    setModalExcluir(false);
    try {
      await excluirAnuncioNoServidor(id);
      mostrarAviso("Anúncio removido!", "sucesso");
      navigate('/meus-produtos');
    } catch (error) {
      mostrarAviso("Erro ao excluir anúncio.", "erro");
    }
  };

  return (
    <div className="tela-enviar-produto">
      {modalExcluir && (
        <div className="modal-overlay">
          <div className="modal-confirmacao">
            <h3>Excluir anúncio?</h3>
            <p>Tem certeza que deseja apagar permanentemente este item da vitrine?</p>
            <div className="modal-botoes">
              <button className="btn-confirmar-limpeza" onClick={handleExcluirConfirmado}>
                Sim, excluir
              </button>
              <button className="btn-cancelar-limpeza" onClick={() => setModalExcluir(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <h2>Editar Anúncio</h2>
      <form className="form-anuncio" onSubmit={salvarEdicao}>
        
        <label>Imagens do Produto ({imagens.length})</label>
        <div className="preview-grid" style={{ 
          display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px',
          background: '#f9f9f9', padding: '10px', borderRadius: '8px', minHeight: '100px'
        }}>
          {imagens.map((img, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={img} className="preview-foto-mini" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
              <button type="button" onClick={() => setImagens(imagens.filter((_, idx) => idx !== i))}
                style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}> × </button>
            </div>
          ))}
          <label style={{ width: '80px', height: '80px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '5px', fontSize: '24px', color: '#888' }}>
            + <input type="file" accept="image/*" multiple onChange={handleAdicionarImagem} style={{ display: 'none' }} />
          </label>
        </div>

        <input 
          placeholder="Nome" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          required 
        />
        
        <input 
          placeholder="Preço" 
          type="text" 
          value={preco} 
          onChange={e => {
            const valor = e.target.value.replace(/[^0-9.,]/g, '');
            setPreco(valor);
          }} 
          required 
        />

        <input 
          placeholder="Cidade" 
          value={cidade} 
          onChange={e => setCidade(e.target.value)} 
          required 
        />
        
        <select value={categoria} onChange={e => setCategoria(e.target.value)} required className="input-select">
          <option value="">Selecione uma Categoria</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Roupas">Roupas</option>
          <option value="Móveis">Móveis</option>
          <option value="Esportes">Esportes</option>
          <option value="Outros">Outros</option>
        </select>

        <textarea placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} rows={4} />
        
        <button type="submit" className="btn-finalizar" disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar Alterações"}
        </button>
        
        <button 
          type="button" 
          onClick={() => setModalExcluir(true)} 
          style={{ backgroundColor: '#f44336', marginTop: '10px' }} 
          className="btn-finalizar"
        >
          Remover Anúncio
        </button>
      </form>
    </div>
  );
}

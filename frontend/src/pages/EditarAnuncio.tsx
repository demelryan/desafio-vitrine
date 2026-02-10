import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Anunciar.css'; 

export function EditarAnuncio({ anuncios, editarAnuncioNoServidor, excluirAnuncioNoServidor, mostrarAviso }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [desc, setDesc] = useState('');
  
  const [previewImagens, setPreviewImagens] = useState<string[]>([]);
  const [arquivosNovos, setArquivosNovos] = useState<File[]>([]);
  
  const [carregando, setCarregando] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false); 

  useEffect(() => {
    const produto = anuncios.find((p: any) => String(p.id) === String(id));
    if (produto) {
      setNome(produto.nome);
      setPreco(String(produto.preco));
      setCidade(produto.cidade);
      setCategoria(produto.categoria || '');
      setDesc(produto.descricao || '');
      
      const imgsExistentes = produto.imagens?.map((img: any) => img.imagem) || [];
      const todasImagens = imgsExistentes.length > 0 ? imgsExistentes : (produto.imagem_url ? [produto.imagem_url] : []);
      setPreviewImagens(todasImagens);
    }
  }, [id, anuncios]);

  const handleAdicionarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const novosFiles = Array.from(files);
      setArquivosNovos(prev => [...prev, ...novosFiles]);

      novosFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImagens(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removerImagemPreview = (index: number) => {
    if (previewImagens.length <= 1) {
      mostrarAviso("O anúncio precisa de pelo menos uma imagem!", "erro");
      return;
    }

    const novasPreviews = previewImagens.filter((_, i) => i !== index);
    setPreviewImagens(novasPreviews);
    setArquivosNovos([]); 
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (carregando) return;
    setCarregando(true);
    
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco.replace(',', '.'));
    formData.append('cidade', cidade);
    formData.append('categoria', categoria);
    formData.append('descricao', desc);

    if (arquivosNovos.length > 0) {
      formData.append('imagem', arquivosNovos[0]);
      arquivosNovos.forEach((file) => {
        formData.append('imagens_adicionais', file);
      });
    }

    try {
      const sucesso = await editarAnuncioNoServidor(id, formData);
      if (sucesso) {
        mostrarAviso("Anúncio atualizado com sucesso!", "sucesso");
        setTimeout(() => navigate('/meus-produtos'), 800);
      } else {
        mostrarAviso("Erro ao salvar alterações.", "erro");
      }
    } catch (error) {
      mostrarAviso("Erro na ligação ao servidor.", "erro");
    } finally {
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
            <p>Esta ação não pode ser desfeita.</p>
            <div className="modal-botoes">
              <button className="btn-confirmar-limpeza" onClick={handleExcluirConfirmado}>Excluir</button>
              <button className="btn-cancelar-limpeza" onClick={() => setModalExcluir(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <h2>Editar Anúncio</h2>
      <form className="form-anuncio" onSubmit={salvarEdicao}>
        
        <label>Imagens do Produto</label>
        <div className="preview-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          {previewImagens.map((img, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img 
                src={img} 
                alt={`Preview ${i}`} 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }} 
              />
              <button 
                type="button" 
                onClick={() => removerImagemPreview(i)}
                style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>
          ))}
          <label style={{ width: '80px', height: '80px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '5px', fontSize: '24px', color: '#888' }}>
            + <input type="file" accept="image/*" multiple onChange={handleAdicionarImagem} style={{ display: 'none' }} />
          </label>
        </div>

        <input placeholder="Nome do Produto" value={nome} onChange={e => setNome(e.target.value)} required />
        
        <input 
          placeholder="Preço (Ex: 99.90)" 
          type="text" 
          value={preco} 
          onChange={e => setPreco(e.target.value.replace(/[^0-9.,]/g, ''))} 
          required 
        />

        <input placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} required />
        
        <select value={categoria} onChange={e => setCategoria(e.target.value)} required className="input-select">
          <option value="">Selecione uma Categoria</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Roupas">Roupas</option>
          <option value="Móveis">Móveis</option>
          <option value="Esportes">Esportes</option>
          <option value="Outros">Outros</option>
        </select>

        <textarea placeholder="Descrição detalhada" value={desc} onChange={e => setDesc(e.target.value)} rows={4} />
        
        <button type="submit" className="btn-finalizar" disabled={carregando}>
          {carregando ? "Salvando..." : "Confirmar Edição"}
        </button>
        
        <button type="button" onClick={() => setModalExcluir(true)} 
          style={{ backgroundColor: '#f44336', marginTop: '10px' }} className="btn-finalizar">
          Remover Anúncio Permanentemente
        </button>
      </form>
    </div>
  );
}

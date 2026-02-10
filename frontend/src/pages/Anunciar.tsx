import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Anunciar.css';

interface AnunciarProps {
  adicionarAnuncio: (anuncio: FormData) => Promise<void>;
  mostrarAviso: (msg: string, tipo: 'sucesso' | 'erro') => void;
}

export function Anunciar({ adicionarAnuncio, mostrarAviso }: AnunciarProps) {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [desc, setDesc] = useState('');
  
  const [imagens, setImagens] = useState<string[]>([]);
  const [arquivosReais, setArquivosReais] = useState<File[]>([]);
  
  const [enviando, setEnviando] = useState(false);

  const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(e.target.files || []);
    setArquivosReais(prev => [...prev, ...arquivos]);

    arquivos.forEach(arquivo => {
      const leitor = new FileReader();
      leitor.onloadend = () => {
        setImagens(prev => [...prev, leitor.result as string]);
      };
      leitor.readAsDataURL(arquivo);
    });
  };

  const removerImagem = (indexParaRemover: number) => {
    setImagens(imagens.filter((_, index) => index !== indexParaRemover));
    setArquivosReais(arquivosReais.filter((_, index) => index !== indexParaRemover));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      mostrarAviso("Você precisa estar logado para anunciar!", "erro");
      return;
    }

    if (enviando) return;
    setEnviando(true);

    const precoLimpo = preco.replace(/\./g, '').replace(',', '.');
    const precoNumerico = Number(precoLimpo);

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', isNaN(precoNumerico) ? "0" : precoNumerico.toString());
    formData.append('descricao', desc);
    formData.append('cidade', cidade); // Corrigido para 'cidade'
    formData.append('categoria', categoria);

    if (arquivosReais.length > 0) {
      // Primeira imagem como principal para o campo imagem_url do Django
      formData.append('imagem_url', arquivosReais[0]);

      // Envia todas as fotos para a galeria (conforme configurado na View)
      arquivosReais.forEach((arquivo) => {
        formData.append('imagens_adicionais', arquivo);
      });
    }

    try {
      await adicionarAnuncio(formData);
      mostrarAviso("Anúncio publicado com sucesso!", "sucesso");
      setTimeout(() => navigate('/'), 1000); 
    } catch (err: any) {
      console.error("Erro detalhado do servidor:", err.response?.data);
      mostrarAviso("Erro ao publicar. Verifique os campos.", "erro");
      setEnviando(false);
    }
  };

  return (
    <div className="tela-enviar-produto">
      <h2>O que você está anunciando?</h2>
      <form className="form-anuncio" onSubmit={enviar}>
        
        <div className="upload-container">
          {imagens.length > 0 ? (
            <div className="preview-grid">
              {imagens.map((img, index) => (
                <div key={index} className="container-foto-preview" style={{ position: 'relative' }}>
                  <img src={img} alt={`Preview ${index}`} className="preview-foto-mini" />
                  <button 
                    type="button" 
                    className="btn-remover-foto-preview"
                    onClick={() => removerImagem(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label htmlFor="input-foto" className="add-mais" style={{ cursor: 'pointer' }}>+</label>
            </div>
          ) : (
            <label htmlFor="input-foto" className="label-foto" style={{ cursor: 'pointer' }}>
              Selecionar Fotos
            </label>
          )}
          
          <input 
            id="input-foto"
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImagem} 
            style={{ display: 'none' }} 
            disabled={enviando}
          />
        </div>

        <input placeholder="Nome do Produto" value={nome} onChange={e => setNome(e.target.value)} required disabled={enviando} />
        <input placeholder="Preço (Ex: 150,00)" type="text" value={preco} onChange={e => setPreco(e.target.value.replace(/[^0-9.,]/g, ''))} required disabled={enviando} />
        <input placeholder="Sua Cidade" value={cidade} onChange={e => setCidade(e.target.value)} required disabled={enviando} />

        <select value={categoria} onChange={e => setCategoria(e.target.value)} required className="input-select" disabled={enviando}>
          <option value="">Selecione uma Categoria</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Roupas">Roupas</option>
          <option value="Móveis">Móveis</option>
          <option value="Esportes">Esportes</option>
          <option value="Outros">Outros</option>
        </select>

        <textarea placeholder="Descrição detalhada..." value={desc} onChange={e => setDesc(e.target.value)} rows={4} disabled={enviando} />
        
        <button type="submit" className="btn-finalizar" disabled={enviando}>
          {enviando ? "Publicando..." : "Publicar Anúncio"}
        </button>
      </form>
    </div>
  );
}

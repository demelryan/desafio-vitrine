import { Link } from 'react-router-dom';
import { formatarMoeda } from '../utils/formatadores';
import './Vitrine.css'; 

export function MeusProdutos({ anuncios }: { anuncios: any[] }) {
  const obterUsuarioLogado = () => {
    try {
      const usuarioRaw = localStorage.getItem('usuario');
      if (!usuarioRaw) return null;
      return JSON.parse(usuarioRaw);
    } catch (e) {
      console.error("Erro ao ler usuário do localStorage", e);
      return null;
    }
  };

  const usuarioLogado = obterUsuarioLogado();

  const meusAnuncios = Array.isArray(anuncios) ? anuncios.filter(a => {
    if (!usuarioLogado || !usuarioLogado.id) return false;
    return String(a.vendedor) === String(usuarioLogado.id);
  }) : [];

  return (
    <div className="meus-produtos" style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#4A0072', marginBottom: '20px' }}>
        Gerenciar Meus Anúncios
      </h2>
      
      <div className="vitrine">
        {meusAnuncios.length > 0 ? (
          meusAnuncios.map((item) => {
            const imagemCapa = item.imagens && item.imagens.length > 0 
              ? item.imagens[0].imagem 
              : item.imagem_url;

            return (
              <Link to={`/editar/${item.id}`} key={item.id} className="card-produto" style={{ textDecoration: 'none' }}>
                <div className="foto-produto-placeholder">
                  {imagemCapa ? (
                    <img src={imagemCapa} alt={item.nome} />
                  ) : (
                    <div className="sem-foto" style={{ padding: '20px', background: '#eee' }}>Sem Foto</div>
                  )}
                </div>
                <div className="info-produto">
                  <h3>{item.nome}</h3>
                  <p className="preco-vitrine">
                    {formatarMoeda(item.preco)}
                  </p>
                  <p className="cidade-vitrine">Categoria: {item.categoria || 'Geral'}</p>
                  <p className="cidade-vitrine">Cidade: {item.cidade || 'Não informada'}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', width: '100%', marginTop: '50px' }}>
            <p style={{ color: '#666' }}>Você ainda não tem nenhum anúncio ativo.</p>
            <Link to="/enviar" className="btn-anunciar-header" style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'none', background: '#4A0072', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
              Criar meu primeiro anúncio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

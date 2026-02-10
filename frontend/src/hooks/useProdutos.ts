import { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:8000/api/produtos/';

export function useProdutos() {
  const [anuncios, setAnuncios] = useState<any[]>([]);

  const carregarProdutos = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setAnuncios(data.reverse());
      }
    } catch (err) { console.error("Erro ao conectar com o servidor Django:", err); }
  };

  useEffect(() => { carregarProdutos(); }, []);

  const adicionarAnuncio = async (novo: FormData) => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: novo
      });

      if (res.ok) {
        const anuncioSalvo = await res.json();
        setAnuncios(prev => [anuncioSalvo, ...prev]);
        return true; 
      } else {
        const erroLog = await res.json();
        console.error("O Django recusou o anúncio:", erroLog);
        throw new Error("Erro de validação no servidor");
      }
    } catch (err) {
      console.error("Erro ao enviar anúncio:", err);
      throw err; 
    }
  };

  const editarAnuncioNoServidor = async (id: any, dadosEditados: any) => {
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: 'PATCH', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(dadosEditados)
      });
      if (res.ok) {
        const data = await res.json();
        setAnuncios(prev => prev.map(a => String(a.id) === String(id) ? { ...a, ...data } : a));
        return true; 
      }
    } catch (err) { console.error("Erro ao editar no Django:", err); }
    return false;
  };

  const excluirAnuncioNoServidor = async (id: any) => {
    setAnuncios(prev => prev.filter(a => String(a.id) !== String(id)));
    try {
      await fetch(`${API_URL}${id}/`, { 
        method: 'DELETE', 
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
      });
    } catch (err) { console.error("Erro ao excluir no Django:", err); }
  };

  return { anuncios, adicionarAnuncio, editarAnuncioNoServidor, excluirAnuncioNoServidor };
}

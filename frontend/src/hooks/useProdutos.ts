import { useState, useEffect } from 'react';

export function useProdutos() {
  const [anuncios, setAnuncios] = useState<any[]>([]);

  const carregarProdutos = async () => {
    try {
      const res = await fetch('http://localhost:3000/produtos');
      if (res.ok) {
        const data = await res.json();
        setAnuncios(data.reverse());
      }
    } catch (err) { console.error("Erro ao conectar com o servidor:", err); }
  };

  useEffect(() => { carregarProdutos(); }, []);

  const adicionarAnuncio = async (novo: any) => {
    const res = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(novo)
    });
    if (res.ok) {
      const anuncioSalvo = await res.json();
      setAnuncios(prev => [anuncioSalvo, ...prev]);
    }
  };

  const editarAnuncioNoServidor = async (id: any, dadosEditados: any) => {
    try {
      const res = await fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(dadosEditados)
      });
      if (res.ok) {
        const data = await res.json();
        setAnuncios(prev => prev.map(a => String(a.id) === String(id) ? { ...a, ...(data.produto || data) } : a));
        return true; 
      }
    } catch (err) { console.error("Erro ao editar:", err); }
    return false;
  };

  const excluirAnuncioNoServidor = async (id: any) => {
    setAnuncios(prev => prev.filter(a => String(a.id) !== String(id)));
    try {
      await fetch(`http://localhost:3000/produtos/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
      });
    } catch (err) { console.error("Erro ao excluir:", err); }
  };

  return { anuncios, adicionarAnuncio, editarAnuncioNoServidor, excluirAnuncioNoServidor };
}

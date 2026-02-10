import { useState, useEffect } from 'react';

const API_CARRINHO = 'http://127.0.0.1:8000/api/carrinho/';

export function useCarrinho(usuario: string | null) {
  const [itens, setItens] = useState<any[]>([]);
  const token = localStorage.getItem('token');
  
  const limpo = (n: string | null) => n ? n.replace(/^"(.*)"$/, '$1') : '';

  const carregarDados = () => {
    if (usuario && token) {
      fetch(API_CARRINHO, {
        headers: { 'Authorization': `Bearer ${limpo(token)}` }
      })
      .then(r => r.json())
      .then(data => setItens(Array.isArray(data) ? data : []))
      .catch(() => setItens([]));
    } else {
      setItens([]);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [usuario, token]);

  const adicionarItem = (produto: any) => {
    if (!usuario || !token) return;
    
    fetch(API_CARRINHO, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${limpo(token)}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        produto: produto.id,
        quantidade: 1 
      })
    })
    .then(r => {
      if (r.ok) carregarDados();
    });
  };

  const alterarQuantidade = (id: number, novaQtd: number) => {
    if (novaQtd < 1 || !token) return;
    
    fetch(`${API_CARRINHO}${id}/`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${limpo(token)}`
      },
      body: JSON.stringify({ quantidade: novaQtd })
    })
    .then(() => {
        setItens(prev => prev.map(i => i.id === id ? { ...i, quantidade: novaQtd } : i));
    });
  };

  const removerItem = (id: number) => {
    if (!token) return;
    fetch(`${API_CARRINHO}${id}/`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${limpo(token)}` }
    })
    .then(() => {
        setItens(prev => prev.filter(i => i.id !== id));
    });
  };

  const esvaziar = async () => {
    if (!token || itens.length === 0) return;

    try {
      const deletarPromessas = itens.map(item => 
        fetch(`${API_CARRINHO}${item.id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${limpo(token)}` }
        })
      );

      await Promise.all(deletarPromessas);
      
      setItens([]);
    } catch (err) {
      console.error("Erro ao esvaziar carrinho no servidor:", err);
    }
  };

  return { itens, adicionarItem, alterarQuantidade, removerItem, esvaziar };
}

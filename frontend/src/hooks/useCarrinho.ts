import { useState, useEffect } from 'react';

const API_CARRINHO = 'http://127.0.0.1:8000/api/carrinho/';

export function useCarrinho(usuario: string | null) {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const token = localStorage.getItem('token');
  
  const limpo = (n: string | null) => n ? n.replace(/^"(.*)"$/, '$1') : '';

  useEffect(() => {
    if (usuario && token) {
      fetch(API_CARRINHO, {
        headers: { 
          'Authorization': `Bearer ${limpo(token)}` 
        }
      })
      .then(r => r.json())
      .then(data => setCarrinho(Array.isArray(data) ? data : []))
      .catch(() => setCarrinho([]));
    } else {
      setCarrinho([]);
    }
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
    .then(r => r.json())
    .then(itemSalvo => {
      fetch(API_CARRINHO, {
        headers: { 'Authorization': `Bearer ${limpo(token)}` }
      })
      .then(r => r.json())
      .then(data => setCarrinho(data));
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
        setCarrinho(prev => prev.map(i => i.id === id ? { ...i, quantidade: novaQtd } : i));
    });
  };

  const removerItem = (id: number) => {
    if (!token) return;
    fetch(`${API_CARRINHO}${id}/`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${limpo(token)}` }
    })
    .then(() => {
        setCarrinho(prev => prev.filter(i => i.id !== id));
    });
  };

  return { carrinho, adicionarItem, alterarQuantidade, removerItem };
}

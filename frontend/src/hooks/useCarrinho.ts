import { useState, useEffect } from 'react';

export function useCarrinho(usuario: string | null) {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const token = localStorage.getItem('token');
  
  const limpo = (n: string | null) => n ? n.replace(/^"(.*)"$/, '$1') : '';

  useEffect(() => {
    if (usuario && token) {
      fetch(`http://localhost:3000/carrinho`, {
        headers: { 
          'Authorization': `Bearer ${limpo(token)}` 
        }
      })
      .then(r => r.json())
      .then(data => setCarrinho(Array.isArray(data) ? data : []))
      .catch(() => setCarrinho([]));
    }
  }, [usuario, token]);

  const adicionarItem = (produto: any) => {
    if (!usuario || !token) return;
    
    const itemExistente = carrinho.find(i => i.produtoId === produto.id);
    const authHeader = { 
      'Authorization': `Bearer ${limpo(token)}`, 
      'Content-Type': 'application/json' 
    };
    
    if (itemExistente) {
      const novaQtd = itemExistente.quantidade + 1;
      setCarrinho(prev => prev.map(i => i.produtoId === produto.id ? {...i, quantidade: novaQtd} : i));
      
      fetch(`http://localhost:3000/carrinho/${itemExistente.id}`, {
        method: 'PUT',
        headers: authHeader,
        body: JSON.stringify({ quantidade: novaQtd })
      });
    } else {
      fetch('http://localhost:3000/carrinho', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ produtoId: produto.id, quantidade: 1 })
      })
      .then(r => r.json())
      .then(itemSalvo => {
        setCarrinho(prev => [...prev, { ...produto, ...itemSalvo }]);
      });
    }
  };

  const alterarQuantidade = (id: number, novaQtd: number) => {
    if (novaQtd < 1 || !token) return;
    setCarrinho(prev => prev.map(i => i.id === id ? { ...i, quantidade: novaQtd } : i));
    
    fetch(`http://localhost:3000/carrinho/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${limpo(token)}`
      },
      body: JSON.stringify({ quantidade: novaQtd })
    });
  };

  const removerItem = (id: number) => {
    if (!token) return;
    setCarrinho(prev => prev.filter(i => i.id !== id));
    fetch(`http://localhost:3000/carrinho/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${limpo(token)}` }
    });
  };

  const esvaziar = () => {
    if (!token) return;
    setCarrinho([]);
    fetch(`http://localhost:3000/carrinho/limpar/vaziar`, { 
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${limpo(token)}` }
    });
  };

  return { carrinho, adicionarItem, alterarQuantidade, removerItem, esvaziar };
}

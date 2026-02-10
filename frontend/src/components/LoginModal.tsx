import { useState } from 'react';

interface LoginModalProps {
  setModalAberto: (aberto: boolean) => void;
  onLoginSuccess: (nome: string) => void;
  mostrarAviso: (msg: string, tipo: 'sucesso' | 'erro') => void;
}

export function LoginModal({ setModalAberto, onLoginSuccess, mostrarAviso }: LoginModalProps) {
  const [modoLogin, setModoLogin] = useState(true);
  const [username, setUsername] = useState(''); 
  const [senha, setSenha] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');

  const realizarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = modoLogin 
        ? 'http://127.0.0.1:8000/api/login/' 
        : 'http://127.0.0.1:8000/api/usuarios/registrar/'; 

      const corpo = modoLogin 
        ? { username, password: senha } 
        : { username, password: senha, first_name: nomeUsuario };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (modoLogin) {
          localStorage.setItem('token', data.access);
          localStorage.setItem('refresh', data.refresh);
          localStorage.setItem('usuario', username);
          
          onLoginSuccess(username);
          setModalAberto(false);
          mostrarAviso(`Bem-vindo, ${username}!`, 'sucesso');
        } else {
          mostrarAviso("Conta criada com sucesso! Faça login.", 'sucesso');
          setModoLogin(true);
          setSenha('');
        }
      } else {
        mostrarAviso("Usuário ou senha incorretos", 'erro');
      }
    } catch (err) {
      mostrarAviso("Erro ao conectar com o servidor Django.", "erro");
    }
  };

  return (
    <div className="janela-modal">
      <div className="conteudo-modal">
        <button className="fechar" onClick={() => setModalAberto(false)}>X</button>
        <h2 style={{ marginBottom: '20px' }}>{modoLogin ? 'Login' : 'Criar Conta'}</h2>
        
        <form className="form-login" onSubmit={realizarLogin}>
          {!modoLogin && (
            <input 
              placeholder="Nome Exibição" 
              value={nomeUsuario} 
              onChange={e => setNomeUsuario(e.target.value)} 
              required 
            />
          )}
          <input 
            type="text" 
            placeholder="Nome de Usuário" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-enviar">
            {modoLogin ? 'Entrar' : 'Finalizar Cadastro'}
          </button>
        </form>

        <p onClick={() => { setModoLogin(!modoLogin); setSenha(''); }} className="troca-modo" style={{ marginTop: '15px', cursor: 'pointer', color: '#007bff' }}>
          {modoLogin ? 'Não tem conta? Cadastre-se' : 'Já tem uma conta? Entre aqui'}
        </p>
      </div>
    </div>
  );
}

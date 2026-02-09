import { useState } from 'react';

interface LoginModalProps {
  setModalAberto: (aberto: boolean) => void;
  onLoginSuccess: (nome: string) => void;
  mostrarAviso: (msg: string, tipo: 'sucesso' | 'erro') => void;
}

export function LoginModal({ setModalAberto, onLoginSuccess, mostrarAviso }: LoginModalProps) {
  const [modoLogin, setModoLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');

  const realizarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rota = modoLogin ? '/login' : '/cadastro';
      const res = await fetch(`http://localhost:3000${rota}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modoLogin ? { email, senha } : { nome: nomeUsuario, email, senha })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (modoLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('usuario', data.nome);
          
          onLoginSuccess(data.nome);
          setModalAberto(false);
          mostrarAviso(`Bem-vindo, ${data.nome}!`, 'sucesso');
        } else {
          mostrarAviso("Conta criada com sucesso! Faça login.", 'sucesso');
          setModoLogin(true);
          setSenha('');
        }
      } else {
        mostrarAviso(data.mensagem || "Erro na operação", 'erro');
      }
    } catch (err) {
      mostrarAviso("Erro ao conectar com o servidor.", "erro");
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
              placeholder="Nome completo" 
              value={nomeUsuario} 
              onChange={e => setNomeUsuario(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
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

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erroEmail, setErroEmail] = useState('')
  const [erroSenha, setErroSenha] = useState('')

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const btnAtivo = emailValido && senha.length >= 8

  async function handleLogin(e) {
    e.preventDefault()
    setErro('')
    setErroEmail('')
    setErroSenha('')

    let valido = true

    if (!email) {
      setErroEmail('O e-mail não pode estar vazio.')
      valido = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErroEmail('Insira um e-mail válido.')
      valido = false
    }

    if (senha.length < 8) {
      setErroSenha('A senha precisa ter no mínimo 8 caracteres.')
      valido = false
    }

    if (!valido) return

    setCarregando(true)

    try {
      const resposta = await api.post('/auth/login', { email, senha })
      localStorage.setItem('spl_token', resposta.data.token)
      if (resposta.data.triagem_concluida === true) {
        alert('Dashboard disponível em breve!')
      } else if (resposta.data.triagem_concluida === false) {
        navigate('/triagem')
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Usuário ou senha inválido.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="">
      <div className="card">
        <div className="logo">
          <button className="button_logo">+</button>
          <h3>SPL</h3>
          <p className="text-auth">Saúde em Primeiro Lugar</p>
        </div>

        <div className="form-auth">
          <h2>Entrar</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erroEmail && <p className="erro-campo">{erroEmail}</p>}

            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {erroSenha && <p className="erro-campo">{erroSenha}</p>}

            {erro && <p className="erro-api">{erro}</p>}

            <button className="btn-auth" type="submit" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-auth">
            Não tem conta?{' '}
            <span className="link" onClick={() => navigate('/cadastro')}>
              Criar conta
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
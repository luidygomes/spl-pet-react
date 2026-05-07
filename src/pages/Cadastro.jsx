import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Cadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmSenha, setConfirmSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [erroNome, setErroNome] = useState('')
  const [erroCpf, setErroCpf] = useState('')
  const [erroTelefone, setErroTelefone] = useState('')
  const [erroEmail, setErroEmail] = useState('')
  const [erroSenha, setErroSenha] = useState('')
  const [erroConfirmSenha, setErroConfirmSenha] = useState('')

  const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  async function handleCadastro(e) {
    e.preventDefault()
    setErro('')
    setErroNome('')
    setErroCpf('')
    setErroTelefone('')
    setErroEmail('')
    setErroSenha('')
    setErroConfirmSenha('')

    let valido = true

    if (!nome) {
      setErroNome('O nome não pode estar vazio.')
      valido = false
    }

    if (!regexCpf.test(cpf)) {
      setErroCpf("CPF inválido. Use o formato '000.000.000-00'.")
      valido = false
    }

    if (!telefone) {
      setErroTelefone('O telefone não pode estar vazio.')
      valido = false
    }

    if (!email) {
      setErroEmail('O e-mail não pode estar vazio.')
      valido = false
    } else if (!regexEmail.test(email)) {
      setErroEmail('Insira um e-mail válido.')
      valido = false
    }

    if (senha.length < 8) {
      setErroSenha('A senha precisa ter no mínimo 8 caracteres.')
      valido = false
    }

    if (confirmSenha !== senha) {
      setErroConfirmSenha('As senhas não coincidem.')
      valido = false
    }

    if (!valido) return

    setCarregando(true)
    try {
      const resposta = await api.post('/auth/cadastro', { nome, cpf, telefone, email, senha })
      localStorage.setItem('spl_token', resposta.data.token)
      navigate('/triagem', { state: { cadastroSucesso: true } })
      alert('Cadastro efetuado com sucesso!')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card">
        <div className="logo">
          <button className="button_logo">+</button>
          <h3>SPL</h3>
          <p className='text-auth'>Saúde em Primeiro Lugar</p>
        </div>

        <div className="form-auth">
          <h2>Criar conta</h2>
          <form onSubmit={handleCadastro}>

            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {erroNome && <p className="erro-campo">{erroNome}</p>}

            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            {erroCpf && <p className="erro-campo">{erroCpf}</p>}

            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            {erroTelefone && <p className="erro-campo">{erroTelefone}</p>}

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

            <label htmlFor="confirmSenha">Confirmar senha</label>
            <input
              id="confirmSenha"
              type="password"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
            />
            {erroConfirmSenha && <p className="erro-campo">{erroConfirmSenha}</p>}

            {erro && <p className="erro-api">{erro}</p>}

            <button className="btn-auth" type="submit" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <p className='text-auth'>
            Já tem conta?{' '}
            <span className="link" onClick={() => navigate('/')}>
              Entrar
            </span>
          </p>
          <p className='dados text-auth'>
            Seus dados são protegidos e não serão compartilhados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
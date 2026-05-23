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
  const [showConfirmacao, setShowConfirmacao] = useState(false)

  const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatTelefone = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length <= 10) {
      return v
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return v
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  };

  const btnAtivo = nome.trim() !== '' &&
    regexCpf.test(cpf) &&
    telefone.trim() !== '' &&
    regexEmail.test(email) &&
    senha.length >= 8 &&
    confirmSenha === senha;


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

    setShowConfirmacao(true)
  }

  async function confirmarCadastro() {
    setCarregando(true)
    try {
      const resposta = await api.post('/auth/cadastro', { nome, cpf, telefone, email, senha })
      localStorage.setItem('spl_token', resposta.data.token)
      navigate('/triagem', { state: { cadastroSucesso: true } })
      alert('Cadastro efetuado com sucesso!')
    } catch (err) {
      if (err.response) {
        setErro(err.response?.data?.erro)
      } else {
        setErro('Não foi possível conectar ao servidor.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className='auth-page'>
      <div className='font-sans bg-white rounded-xl w-[100%] max-w-[420px] pt-[32px] pr-[28px] pb-[28px] pl-[28px] shadow-xl'>
        <div className='flex-col mt-15'>

          <div className='flex justify-center items-center bg-[#2e7d55] text-white text-[40px] h-[52px] w-[52px] rounded-[20%] cursor-default mb-[20px] ml-auto mr-auto mt-0 '>
            <svg className='stroke-white w-8 fill-none stroke-[2.2]' viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>

          <div className='text-center mt-[22px] mb-[6px]'>
            <h1 className='font-serif text-[21px] flex items-center justify-center gap-2 text-[#1c2b22]'>
              SPL
            </h1>
            <p className='font-sans text-[13px] leading-5 text-[#5a7265]'>
              Saúde em Primeiro Lugar
            </p>
          </div>

        {showConfirmacao ? (
          <form className='flex flex-col gap-[17px] mt-6' onSubmit={(e) => e.preventDefault()}>
            <h2 className='font-serif text-[18px] text-[#1c2b22] text-center mb-2'>Confirme seus dados</h2>
            <div className="mb-4 text-left text-[14px] flex flex-col gap-2 w-full text-black">
              <p><strong>Nome:</strong> {nome}</p>
              <p><strong>CPF:</strong> {cpf}</p>
              <p><strong>Telefone:</strong> {telefone}</p>
              <p><strong>E-mail:</strong> {email}</p>
            </div>
            
            <div className='flex justify-center m-[-5px]'>    
              {erro && <p className="text-red-600 text-sm bg-red-50 rounded-lg">{erro}</p>}
            </div>
            
            <div className='flex gap-2 flex-col mt-2'>
              <button
                className='w-full p-3 border-none rounded-lg bg-[#1a4a3a] hover:bg-[#2d6a50] transition text-white cursor-pointer font-medium'
                type="button"
                onClick={confirmarCadastro}
                disabled={carregando}
              >
                {carregando ? 'Cadastrando...' : 'Confirmar'}
              </button>

              <button
                className='w-full p-3 border-none rounded-lg bg-[#a1a1a2] hover:bg-[#8f8f90] transition text-white cursor-pointer font-medium'
                type="button"
                onClick={() => setShowConfirmacao(false)}
                disabled={carregando}
              >
                Voltar
              </button>
            </div>
          </form>
        ) : (
          <form className='flex flex-col gap-[17px] mt-6' onSubmit={handleCadastro}>
            <h2 className='font-serif text-[18px] text-[#1c2b22] text-left mb-2'>Criar conta</h2>

            <div className='flex flex-col gap-[6px]'>
              <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="nome">Nome</label>
              <input
                className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erroNome ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`}
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {erroNome && <p className="text-red-500 text-xs pt-0 mb-1">{erroNome}</p>}
            </div>

            <div className='flex flex-col gap-[6px]'>
              <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="cpf">CPF</label>
              <input
                className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erroCpf ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`}
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
              />
              {erroCpf && <p className="text-red-500 text-xs pt-0 mb-1">{erroCpf}</p>}
            </div>

            <div className='flex flex-col gap-[6px]'>
              <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="telefone">Telefone</label>
              <input
                className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erroTelefone ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`}
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
              />
              {erroTelefone && <p className="text-red-500 text-xs pt-0 mb-1">{erroTelefone}</p>}
            </div>

            <div className='flex flex-col gap-[6px]'>
              <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="email">E-mail</label>
              <input
                className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erroEmail ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {erroEmail && <p className="text-red-500 text-xs pt-0 mb-1">{erroEmail}</p>}
            </div>

            <div className='flex flex-col gap-[6px]'>
              <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="senha">Senha</label>
              <input
                className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erroSenha ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`}
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {erroSenha && <p className="text-red-500 text-xs pt-0 mb-1">{erroSenha}</p>}
            </div>

            <div className='flex flex-col gap-[6px]'>
              <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="confirmSenha">Confirmar senha</label>
              <input
                className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erroConfirmSenha ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`}
                id="confirmSenha"
                type="password"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
              />
              {erroConfirmSenha && <p className="text-red-500 text-xs pt-0 mb-1">{erroConfirmSenha}</p>}
            </div>

            <div className='flex justify-center m-[-5px]'>    
              {erro && <p className="text-red-600 text-sm bg-red-50 rounded-lg">{erro}</p>}
            </div>

            <button
              className={`w-full p-3 border-none rounded-lg bg-[#1a4a3a] hover:bg-[#2d6a50] transition text-white cursor-pointer mt-2 font-medium ${(!btnAtivo && !carregando) ? 'opacity-50 !cursor-default' : ''}`}
              type="submit"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>

            <p className="text-[13px] text-[#5a7265] text-center mt-2">
              Já tem conta?{' '}
              <span className="text-[#2e7d55] font-semibold cursor-pointer hover:underline" onClick={() => navigate('/')}>
                Entrar
              </span>
            </p>
            <p className="text-[12px] text-[#6b7280] text-center mt-[-10px]">
              Seus dados são protegidos e não serão compartilhados.
            </p>
          </form>
        )}
        </div>
      </div>
    </div>
  )
}

export default Cadastro
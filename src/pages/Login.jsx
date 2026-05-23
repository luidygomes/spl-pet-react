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
        navigate('/dashboard')
      } else if (resposta.data.triagem_concluida === false) {
        navigate('/triagem')
      }
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
            
          <form className='flex flex-col gap-[17px] mt-6' onSubmit={handleLogin}>
            
            <h2 className='font-serif text-[18px] text-[#1c2b22] text-left mb-2'>Entrar</h2>

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

            <div className='flex justify-center m-[-5px]'>    
              {erro && <p className="text-red-600 text-sm bg-red-50 rounded-lg">{erro}</p>}
            </div>

            <button 
              className={`w-full p-3 border-none rounded-lg bg-[#1a4a3a] hover:bg-[#2d6a50] transition text-white cursor-pointer mt-2 font-medium ${(!btnAtivo && !carregando) ? 'opacity-50 !cursor-default' : ''}`}
              type="submit" 
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
            
            <p className="text-[13px] text-[#5a7265] text-center mt-2">
              Não tem conta?{' '}
              <span className="text-[#2e7d55] font-semibold cursor-pointer hover:underline" onClick={() => navigate('/cadastro')}>
                Criar conta
              </span>
            </p>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login
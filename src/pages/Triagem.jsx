import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Triagem() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    data_nascimento: '', sexo: '', peso_kg: '', altura_cm: '', 
    condicoes: [], usa_medicamentos: null, nivel_atividade: '',
  })

  const [erros, setErros] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiErro, setApiErro] = useState('')

  function handleChange(e) {
    const { name, value, type } = e.target
    const processedValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    setForm(prev => ({ ...prev, [name]: processedValue}))
    setErros(prev => ({ ...prev, [name]: ''}))
  }

  function handleCondicoes(e) {
    const { value, checked } = e.target

    if (value === 'nenhuma') {
      //se marcou 'nenhuma', remove as outras opções
      setForm(prev => ({
        ...prev,
        condicoes: checked ? ['nenhuma'] : []
      }))
    } else {
      // se marcou outra opção, remove 'nenhuma' e atualiza
      setForm(prev => ({
        ...prev,
        condicoes: checked
          ? [...prev.condicoes.filter(c => c !== 'nenhuma'), value]
          : prev.condicoes.filter(c => c !== value)
      }))
    }

    setErros(prev => ({ ...prev, condicoes: ''}))
  }

  function handleMedicamentos(e) {
    //converter para numero inteiro
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: parseInt(value) }))
    setErros(prev => ({ ...prev, [name]: ''}))
  }

  function validar() {
    const erros = {}

    if (!form.data_nascimento)
      erros.data_nascimento = 'Por favor, informe sua data de nascimento.'

    if (!form.sexo)
      erros.sexo = 'Selecione uma opção.'

    if (form.peso_kg === '' || isNaN(form.peso_kg) || form.peso_kg <= 0)
      erros.peso_kg = 'Informe seu peso.'

    if (form.altura_cm === '' || isNaN(form.altura_cm) || form.altura_cm <= 0)
      erros.altura_cm = 'Informe sua altura.'

    if (form.condicoes.length === 0)
      erros.condicoes = 'Selecione ao menos uma opção.'

    if(form.usa_medicamentos === null)
      erros.usa_medicamentos = 'Selecione uma opção.'

    if(!form.nivel_atividade)
      erros.nivel_atividade = 'Selecione seu nível de atividade.'

    return erros
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Para aqui se a validação encontrar erros.

    const novosErros = validar()

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    setLoading(true)
    setApiErro('')

    try {
      const resposta = await api.post('/triagem', form)
      navigate('/dashboard')
    } catch (erro) {
      if (erro.response) {
        setApiErro(erro.response.data.erro) 
      } else {
        setApiErro('Não foi possível conectar ao servidor.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <div className='font-sans bg-white rounded-xl w-[100%] max-w-[420px] pt-[32px] pr-[28px] pb-[28px] pl-[28px] shadow-xl'>
        <div className='flex-col mt-15'>

            <div className='flex justify-center bg-[#2e7d55] text-white text-[40px] h-[52px] w-[52px] rounded-[20%] cursor-default mb-[20px] ml-auto mr-auto mt-0 '>
              <svg className='stroke-white w-8 fill-none stroke-[2.2]' viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>

          <div className='mb-8'>
            <div className='h-2 bg-[#ccddd4] rounded-xl overflow-hidden'>
              <div className='h-[100%] w-[50%] bg-[#2e7d55] rounded-xl'></div>
            </div>
            <div className='text-[12px] mt-2 text-[#5a7265]'>Etapa 1 de 2</div>
          </div>

          <div className='text-center mt-[22px] mb-[6px]'>
            <h1 className='font-serif text-[21px] flex items-center justify-center gap-2 text-[#1c2b22]'>
              <svg className='w-[20px] h-[20px] stroke-[#2e7d55] stroke-2 fill-none stroke-linecap-round stroke-linejoin-round' viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="2"></rect><path d="M9 12h6M9 16h4"></path></svg>  
              Triagem de saúde
            </h1>
            <p className='font-sans text-[13px] leading-5 text-[#5a7265] '>Responda com atenção para montarmos seu perfil personalizado.</p>
          </div>
            
            <form className='flex flex-col gap-[17px] mt-6' onSubmit={handleSubmit}>

              {/* Data de Nascimento */}
              <div className='flex flex-col gap-[6px]'>
                <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="datanascimento">Data de Nascimento</label>
                <input 
                  name="data_nascimento"
                  value={form.data_nascimento} 
                  onChange={handleChange} 
                  className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erros.data_nascimento ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-t-[6px] rounded-b-[6px] text-inherit text-[14px] bg-white text-[#1c2b22] `}
                  id="datanascimento" 
                  type="date"
                  />
                {erros.data_nascimento && (
                  <p className="text-red-500 text-xs pt-0 mb-3">{erros.data_nascimento}</p>
                )}
              </div>

              {/* Sexo Biológico */}
              <div className='flex flex-col gap-[6px]'>
                <p className='text-[13px] font-medium text-[#374b3e]'>Sexo Biológico</p>
                <div className="flex flex-col gap-2">
                  <label className='flex items-center gap-[10px] cursor-pointer'>
                    <input className="accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] rounded-md flex items-center" type="radio" id="m" name="sexo" value="masculino" onChange={handleChange}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="m">Masculino</label>
                  </label>

                  <label className='flex items-center gap-[10px] cursor-pointer'>
                    <input className="accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center" type="radio" id="f" name="sexo" value="feminino" onChange={handleChange}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="f">Feminino</label>
                  </label>
                </div>
                {erros.sexo && <p className="text-red-500 text-xs pt-0 mb-3">{erros.sexo}</p>}
              </div>

              {/* Peso e Altura */}
              <div className='flex gap-4'>
                <div className='flex flex-col gap-1'>
                  <label className='text-[13px] font-medium text-[#374b3e]' htmlFor="peso">Peso (kg)</label>
                  <input className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erros.peso_kg ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-t-[6px] rounded-b-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`} type="number" name="peso_kg" value={form.peso_kg} min="20" onChange={handleChange}/>
                  {erros.peso_kg && <p className="text-red-500 text-xs pt-0 mb-3">{erros.peso_kg}</p>}
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='text-[13px] font-medium text-[#374b3e]'>Altura(cm)</label>
                  <input className={`focus:border-[#2e7d55] focus:shadow-md transition outline-none w-full px-[12px] py-[10px] border-[1.5px] border-solid ${erros.altura_cm ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-t-[6px] rounded-b-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`} type="number" name="altura_cm" value={form.altura_cm} min="50" onChange={handleChange}/>
                  {erros.altura_cm && <p className="text-red-500 text-xs pt-0 mb-3">{erros.altura_cm}</p>}
                </div>
              </div>

              {/* Condição de Saúde */}
              <div className='flex flex-col gap-[6px]'>
                <p className='text-[13px] font-medium text-[#374b3e]'>Você possui alguma condição de saúde diagnosticada?</p>
                <div className='flex flex-col gap-2'>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input className='accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center' type="checkbox" id="hipertenso" name="condicoes" value="hipertensao" checked={form.condicoes.includes('hipertensao')} onChange={handleCondicoes}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="hipertenso">Hipertensão</label>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input className='accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center' type="checkbox" id="diabetes" name="condicoes" value="diabetes" checked={form.condicoes.includes('diabetes')} onChange={handleCondicoes}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="diabetes">Diabetes</label>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input className='accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center' type="checkbox" id="obesidade" name="condicoes" value="obesidade" checked={form.condicoes.includes('obesidade')} onChange={handleCondicoes}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="obesidade">Obesidade</label>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input className='accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center'type="checkbox" id="nenhuma" name="condicoes" value="nenhuma" checked={form.condicoes.includes('nenhuma')} onChange={handleCondicoes}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="nenhuma">Nenhuma</label>
                  </label>

                  {erros.condicoes && <p className="text-red-500 text-xs pt-0 mb-3">{erros.condicoes}</p>}

                </div>
              </div>

              {/*Uso de medicamentos */}
              <div className='flex flex-col gap-2'>  
                <p className='text-[13px] font-medium text-[#374b3e]'>Você faz uso regular de medicamentos?</p>
                 <div className='flex flex-col gap-2'> 

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input className='accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center' type="radio" id="s" name="usa_medicamentos" value="1" onChange={handleMedicamentos}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="s">Sim</label>
                  </label>

                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input className='accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center' type="radio" id="n" name="usa_medicamentos" value="0" onChange={handleMedicamentos}/>
                    <label className='font-medium text-[13px] text-[#374b3e]' htmlFor="n">Não</label>
                  </label>

                  {erros.usa_medicamentos && (<p className="text-red-500 text-xs pt-0 mb-3">{erros.usa_medicamentos}</p>)}

                </div>
              </div>

              {/*Nível de atividade física */}
              <div className='flex flex-col gap-2'>
                <label for="atividade" className='text-[13px] font-medium text-[#374b3e]'>Nível de atividade física</label>
                <div className="relative">

                  <select className={`focus:border-[#2e7d55] focus:shadow-md transition pr-[36px] cursor-pointer outline-none w-full px-[12px] py-[7px] border-[1.5px] border-solid ${erros.nivel_atividade ? 'border-[#c0392b]' : 'border-[#ccddd4]'} rounded-t-[6px] rounded-b-[6px] text-inherit text-[14px] bg-white text-[#1c2b22]`} 
                                    name="nivel_atividade" 
                                    id="atividade" 
                                    value={form.nivel_atividade}
                                    onChange={handleChange}>
                    <option name="nivel_atividade" value selected>Selecione...</option>
                    <option name="nivel_atividade" value="sedentario">Sedentário</option>
                    <option name="nivel_atividade" value="leve">Levemente ativo</option>
                    <option name="nivel_atividade" value="moderado">Moderadamente ativo</option>
                    <option name="nivel_atividade" value="intenso">Muito ativo</option>
                    <option name="nivel_atividade" value="extremo">Extremamente ativo</option>
                  </select>

                  {erros.nivel_atividade && <p className="text-red-500 text-xs pt-0 mb-3">{erros.nivel_atividade}</p>}

                </div>
              </div>

              <div className='flex justify-center m-[-10px]'>    
                {apiErro && (
                <p className="text-red-600 text-sm bg-red-50 rounded-lg">
                {apiErro}
                </p>
                )}
              </div>

              <button className='w-full p-3 border-none rounded-lg bg-[#1a4a3a] hover:bg-[#2d6a50] transition text-white cursor-pointer mt-2 font-medium' type="submit" disabled={loading}>
                {loading ? 'Enviando dados...' : 'Continuar'}
              </button>

              <button className='w-full p-[11px] bg-transparent text-[#5a7265] text-[14px] font-medium border-none cursor-pointer'>Voltar</button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Triagem
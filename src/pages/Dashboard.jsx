import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [info, setInfo] = useState({
    imc: '', 
    classificacao: '', 
    linhas_cuidado: [], 
    nivel_atividade: '', 
    saudacao: '', 
    recomendacoes: [],
    metas: []
  })

  const [loading, setLoading] = useState(false)
  const [apiErro, setApiErro] = useState('')

  const getTagStyle = (cor) => {
    switch (cor) {
      case 'blue':
        return { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]', accent: '#1e40af' }
      case 'green':
        return { bg: 'bg-[#ede9fe]', text: 'text-[#7c3aed]', accent: '#7c3aed' }
      case 'amber':
        return { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', accent: '#d97706' }
      case 'red':
        return { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]', accent: '#b91c1c' }
      default:
        return { bg: 'bg-[#ede9fe]', text: 'text-[#7c3aed]', accent: '#ede9fe' }
    }
  }

  const getOrderedRecommendations = () => {
    if (!info.recomendacoes.length || !info.linhas_cuidado.length) {
      return info.recomendacoes
    }

    const recommendationsByLine = info.recomendacoes.reduce((acc, rec) => {
      const line = rec.linha
      if (!acc[line]) acc[line] = []
      acc[line].push(rec)
      return acc
    }, {})

    const ordered = []
    let hasNext = true

    while (hasNext) {
      hasNext = false
      for (const line of info.linhas_cuidado) {
        const lineRecs = recommendationsByLine[line]
        if (lineRecs && lineRecs.length > 0) {
          ordered.push(lineRecs.shift())
          hasNext = true
        }
      }
    }

    const remaining = info.recomendacoes.filter((rec) => !ordered.includes(rec))
    return [...ordered, ...remaining]
  }

  useEffect(() => {
    async function fetchTriagem() {

      setLoading(true)

      try {
        const { data } = await api.get('/triagem')
        const { data: user } = await api.get('/usuario/dashboard')
        console.log('User data:', user)
        setInfo(prev => ({ ...prev, 
                imc: user.perfil_saude.imc, 
                classificacao: user.perfil_saude.classificacao, 
                linhas_cuidado: user.perfil_saude.linhas_ativas,
                nivel_atividade: user.perfil_saude.nivel_atividade, 
                saudacao : user.saudacao,
                recomendacoes: user.recomendacoes || [],
                metas: user.metas || []
              }))
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

    fetchTriagem()
  }, [])

  return (
    <div id='root' className='font-sans'>

      {/* navbar */}
      <nav className="flex items-center justify-between bg-white border-b border-solid border-[#e5e7eb] h-[50px] pl-5 pr-5 gap-2 text-[16px] text-[#1c2b22] font-semibold sticky top-0 z-10">
          <div className='flex items-center gap-2'>
            <div className='flex justify-center bg-[#2e7d55] text-white text-[40px] h-[34px] w-[34px] rounded-[20%] cursor-default'>
              <svg className='stroke-white w-6 fill-none stroke-[2.4]' viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            SPL
          </div>
    
          <div className='flex items-center gap-3'>
            <div className='bg-[#2e7d55] w-[36px] h-[36px] rounded-[50%] flex items-center justify-center text-[13px] font-[650] text-white'>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
              </svg>
            </div>
            <button onClick={() => navigate('/')} className='bg-none border-none cursor-pointer p-[6px] text-[#6b7280] flex items-center'>
              <svg className='w-5 h-5 stroke-current fill-none stroke-[2]' viewBox='0 0 24 24'>
                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
                <polyline points='16 17 21 12 16 7'></polyline>
                <line x1='21' y1='12' x2='9' y2='12'></line>
              </svg>
            </button>
          </div>
      </nav>

      {/* page */}
      <div className='max-w-[750px] mt-0 mb-0 mr-auto ml-auto pt-[32px] pr-[20px] pb-[60px] pl-[20px]'>
        {/* head */}
        <div className='mb-[26px]'>
          {loading ? (
                <div class="flex animate-pulse space-x-4">
                  <div class="flex-1 space-y-3 py-1">
                    <div class="h-2 rounded bg-[#e0f0e8]"></div>
                  </div>
                </div>
              ) : (
                <h1 className='font-serif text-[25px] font-[500] text-[#1c2b22]'>{info.saudacao}</h1>
              )}
          <p className='text-[13px] text-[#6b7280]'>Veja seu resumo de saúde personalizado.</p>
        </div>

        {/* linhas de cuidado */}
        <section className='mb-[32px]'>

          <div className='flex items-center gap-[7px] mb-[14px]'>
            <svg class="w-4 h-5 stroke-current fill-none stroke-[#6b7280]" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p className='text-[14px] text-[#1c2b22] font-semibold'>Suas linhas de cuidado</p>
          </div>

          <div className='flex flex-wrap gap-[14px]  mb-[28px]'>
            
            {info.linhas_cuidado.map((linha) => {
              const getLineData = (linha) => {
                switch (linha) {
                  case 'diabetica':
                    return {
                      title: 'Linha Diabética',
                      description: 'Acompanhamento para controle de diabetes',
                      bg: 'bg-[#ede9fe]',
                      border: 'border-[#c4b5fd]',
                      iconColor: 'stroke-[#7c3aed]',
                      icon: (
                        <svg className="w-4 h-5 stroke-[#7c3aed] fill-none stroke-[2]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      )
                    }
                  case 'obesidade':
                    return {
                      title: 'Linha Obesidade',
                      description: 'Programa de controle de peso e nutrição',
                      bg: 'bg-[#fef3c7]',
                      border: 'border-[#fde68a]',
                      iconColor: 'stroke-[#d97706]',
                      icon: (
                        <svg className="w-4 h-5 stroke-[#d97706] fill-none stroke-[2]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      )
                    }
                  case 'hipertensos':
                    return {
                      title: 'Linha Hipertensos',
                      description: 'Programa de controle da pressão arterial',
                      bg: 'bg-[#f1aa88]',
                      border: 'border-[#e48777]',
                      iconColor: 'stroke-[#c72104]',
                      icon: (
                        <svg className="w-4 h-5 stroke-[#c72104] fill-none stroke-[2]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      )
                    }
                  case 'ativa':
                    return {
                      title: 'Linha Ativa',
                      description: 'Acompanhamento para se manter saudável',
                      bg: 'bg-[#aeeded]',
                      border: 'border-[#43e3e3]',
                      iconColor: 'stroke-[#0489c7]',
                      icon: (
                        <svg className="w-4 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      )
                    }
                  default:
                    return {
                      title: `Linha ${linha}`,
                      description: 'Linha de cuidado personalizada',
                      bg: 'bg-[#e0f2fe]',
                      border: 'border-[#bae6fd]',
                      iconColor: 'stroke-[#0284c7]',
                      icon: (
                        <svg className="w-4 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      )
                    }
                }
              }

              const { title, description, bg, border, iconColor, icon } = getLineData(linha)

              return (
                <div key={linha} className={`flex-1 min-w-[200px] bg-white border-[1.5px] border-solid ${border} rounded-md pt-[14px] pb-[14px] pr-[18px] pl-[18px] flex items-start gap-[12px] shadow-sm transition hover:shadow-md`}>
                  <div className={`w-[36px] h-[36px] rounded-md flex items-center justify-center shrink-0 ${bg}`}>
                    <div className={iconColor}>
                      {icon}
                    </div>
                  </div>
                  <div>
                    <strong className='text-[13.5px] font-[600] block text-[#1c2b22]'>{title}</strong>
                    <span className='text-[12px] text-[#6b7280]'>{description}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* métricas */}
        <section className='mb-[32px]'>
          <div className='grid grid-cols-3 gap-[14px] mb-[32px]'>

            {/* IMC */}
            <div className='bg-white border-solid border-[#e5e7eb] rounded-md pt-[18px] pb-[18px] pr-[20px] pl-[20px] shadow-md'>
              <div className='text-[11.5px] font-[500] text-[#6b7280] flex items-center gap-[6px] mb-[10px]'>
                <svg class="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 16 9 11 13 15 20 8" />
                  <polyline points="4 20 20 20" />
                </svg>
                <p>IMC</p>
              </div>
              {loading ? (
                <div class="flex animate-pulse space-x-4">
                  <div class="flex-1 space-y-3 py-1">
                    <div class="h-2 rounded bg-[#e0f0e8]"></div>
                  </div>
                </div>
              ) : (
              <div className='text-[26px] font-serif text-[#1c2b22] mb-[8px]'>{info.imc}</div>
              )}
              <span className='inline-flex items-center pt-[3px] pb-[3px] pl-[10px] pr-[10px] rounded-[99px] text-[12px] font-[600] bg-[#fee2e2] text-[#b91c1c]'>{info.classificacao}</span>
            </div>

            {/* NIVEL DE ATIVIDADE */}
            <div className='bg-white border-solid border-[#e5e7eb] rounded-md pt-[18px] pb-[18px] pr-[20px] pl-[20px] shadow-md'>
              <div className='text-[11.5px] font-[500] text-[#6b7280] flex items-center gap-[6px] mb-[10px]'>
                <svg class="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 12 8 12 10 7 12 16 15 12 21 12" />
                </svg>
                <p>NÍVEL DE ATIVIDADE</p>
              </div>

              {loading ? (
                <div class="flex animate-pulse space-x-4">
                  <div class="flex-1 space-y-3 py-1">
                    <div class="h-2 rounded bg-[#e0f0e8]"></div>
                  </div>
                </div>
              ) : (
                <div className='text-[26px] font-serif text-[#1c2b22] mb-[8px]'>{info.nivel_atividade || 'Sem atividade'}</div>
              )}
            </div>

            {/* PROXIMA ETAPA */}
            <div className='bg-white border-solid border-[#e5e7eb] rounded-md pt-[18px] pb-[18px] pr-[20px] pl-[20px] shadow-md'>
              <div className='text-[11.5px] font-[500] text-[#6b7280] flex items-center gap-[6px] mb-[10px]'>
                <svg class="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="8" />
                  <polyline points="12 8 12 12 15 14" />
                </svg>
                <p>PRÓXIMA ETAPA</p>
              </div>
              <div className='text-[13px] text-[#6b7280]'>Agende uma consulta para avaliação completa</div>
            </div>
          </div>
        </section>

        {/* recomendações */}
        <section className='mb-[32px]'>
          <p className='mb-4 text-[14px] text-[#1c2b22] font-semibold'>Recomendações para você</p>
          <div className='flex flex-col gap-[10px]'>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex animate-pulse space-x-4">
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 rounded bg-[#e0f0e8]"></div>
                    <div className="h-3 rounded bg-[#e0f0e8]"></div>
                  </div>
                </div>
              ))
            ) : (
              getOrderedRecommendations().map((rec) => {
                const { bg, text, accent } = getTagStyle(rec.cor)
                return (
                  <div key={rec.slug} className='bg-white border-solid rounded-md pt-[16px] pr-[18px] pb-[16px] pl-[12px] flex items-start content-between gap-[14px] shadow-md relative overflow-hidden'>
                    <div className='absolute left-0 top-0 bottom-0 w-[4px] rounded' style={{ backgroundColor: accent }} />
                    <div className='flex-1 pl-[12px]'>
                      <strong className='text-[14px] font-semibold text-[#1c2b22] block mb-[4px]'>{rec.titulo}</strong>
                      <p className='text-[13px] text-[#6b7280]'>{rec.texto}</p>
                    </div>
                    <span className={`inline-flex items-center pt-[3px] pb-[3px] pl-[10px] pr-[10px] rounded-[99px] text-[12px] font-[600] ${bg} ${text}`}>{rec.linha}</span>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* metas da semana */}
        <section className='mb-[32px]'>
            <div className='bg-white border-solid border rounded-md pt-[22px] pr-[24px] pb-[22px] pl-[24px] shadow-md'>
              <h3 className='text-[15px] font-semibold mb-[16px]'>Metas da semana</h3>
              <div className='flex flex-col gap-[12px]'>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex animate-pulse space-x-4">
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 rounded bg-[#e0f0e8]"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  info.metas.map((meta, index) => (
                    <label key={index} className='flex items-center gap-[12px] text-[13px] text-[#374151] cursor-pointer select-none'>
                      <input type="checkbox" className='accent-[#2e7d55] w-[18px] h-[18px] min-h-[18px] border-2 border-solid border-[#ccddd4] rounded-md flex items-center peer'/>
                      <p className='text-[14px] text-[#374151] cursor-pointer select-none peer-checked:line-through peer-checked:text-[#6b7280]'>{meta.titulo} ({meta.meta})</p>
                      <span></span>
                    </label>
                  ))
                )}
              </div>
            </div>
        </section>

      </div>
    </div>
  )
}




export default Dashboard;
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Dashboard() {
  const [info, setInfo] = useState({
    imc: '', classificacao: '', linhas_cuidado: [],
  })

  const [loading, setLoading] = useState(false)
  const [apiErro, setApiErro] = useState('')

  useEffect(() => {
    async function fetchTriagem() {
      try {
        const { data } = await api.get('/triagem')
        console.log(data)
        setInfo(prev => ({ ...prev, imc: data.imc, classificacao: data.classificacao_imc, linhas_cuidado: data.linhas_cuidado}))
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
    <div>
      <p>Dashboard será criado em breve!</p>
      {loading ? (
        <p>Carregando dados...</p>
      ) : apiErro ? (
        <p className="text-red-600">{apiErro}</p>
      ) : (
        <div>
            <p>IMC: {info.imc}</p>
            <p>Classificação do IMC: {info.classificacao}</p>
            <p>Linhas de Cuidado: {info.linhas_cuidado.join(", ")}</p>
        </div>
      )}
    </div>
  )
}




export default Dashboard;
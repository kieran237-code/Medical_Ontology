import { useState } from 'react'
import { Send, Stethoscope, Apple } from 'lucide-react'
import { getRecommendations, getFoodRisks } from '../services/api'
import { formatRecommendation, formatRisks } from '../services/formatResults'
import ResultTerminal from '../components/ResultTerminal'

function OntologyUsage() {
  const [activeTab, setActiveTab] = useState('disease') // 'disease' ou 'food'

  // ---- État pour l'Usage 1 (maladie -> aliments) ----
  const [diseaseInput, setDiseaseInput] = useState('')
  const [regionInput, setRegionInput] = useState('')
  const [diseaseLoading, setDiseaseLoading] = useState(false)
  const [diseaseResult, setDiseaseResult] = useState('')

  // ---- État pour l'Usage 2 (aliment -> maladies) ----
  const [foodInput, setFoodInput] = useState('')
  const [foodLoading, setFoodLoading] = useState(false)
  const [foodResult, setFoodResult] = useState('')

  // ---- Soumission Usage 1 ----
  async function handleDiseaseSubmit(e) {
    e.preventDefault()
    if (!diseaseInput.trim()) return

    setDiseaseLoading(true)
    setDiseaseResult('')

    try {
      const data = await getRecommendations(diseaseInput.trim(), regionInput.trim())
      setDiseaseResult(formatRecommendation(data))
    } catch (err) {
      setDiseaseResult(`✗ Erreur : ${err.message}`)
    } finally {
      setDiseaseLoading(false)
    }
  }

  // ---- Soumission Usage 2 ----
  async function handleFoodSubmit(e) {
    e.preventDefault()
    if (!foodInput.trim()) return

    setFoodLoading(true)
    setFoodResult('')

    try {
      const data = await getFoodRisks(foodInput.trim())
      setFoodResult(formatRisks(data))
    } catch (err) {
      setFoodResult(`✗ Erreur : ${err.message}`)
    } finally {
      setFoodLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold text-center mb-2">Consulter l'ontologie</h1>
      <p className="text-center text-base-content/70 mb-8">
        Choisissez un usage ci-dessous selon votre besoin.
      </p>

      {/* ---- Onglets ---- */}
      <div role="tablist" className="tabs tabs-boxed bg-base-200 mb-8 max-w-md mx-auto">
        <button
          role="tab"
          className={`tab gap-2 ${activeTab === 'disease' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('disease')}
        >
          <Stethoscope size={16} />
          Par maladie
        </button>
        <button
          role="tab"
          className={`tab gap-2 ${activeTab === 'food' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          <Apple size={16} />
          Par aliment
        </button>
      </div>

      {/* ---- Usage 1 : par maladie ---- */}
      {activeTab === 'disease' && (
        <div className="space-y-4">
          <form onSubmit={handleDiseaseSubmit} className="card bg-base-100 border border-base-300 shadow-sm p-5">
            <p className="text-sm font-medium mb-3">
              Quels aliments recommander ou éviter pour cette maladie ?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Maladie (ex: Diabetes)"
                value={diseaseInput}
                onChange={(e) => setDiseaseInput(e.target.value)}
                className="input input-bordered flex-1"
              />
              <input
                type="text"
                placeholder="Région (optionnel)"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                className="input input-bordered flex-1"
              />
              <button
                type="submit"
                disabled={diseaseLoading}
                className="btn btn-primary gap-2"
              >
                <Send size={16} />
                Envoyer
              </button>
            </div>
          </form>

          <ResultTerminal loading={diseaseLoading} content={diseaseResult} />
        </div>
      )}

      {/* ---- Usage 2 : par aliment ---- */}
      {activeTab === 'food' && (
        <div className="space-y-4">
          <form onSubmit={handleFoodSubmit} className="card bg-base-100 border border-base-300 shadow-sm p-5">
            <p className="text-sm font-medium mb-3">
              Quels sont les risques ou bénéfices de cet aliment ?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Aliment (ex: Okok)"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                className="input input-bordered flex-1"
              />
              <button
                type="submit"
                disabled={foodLoading}
                className="btn btn-primary gap-2"
              >
                <Send size={16} />
                Envoyer
              </button>
            </div>
          </form>

          <ResultTerminal loading={foodLoading} content={foodResult} />
        </div>
      )}

    </div>
  )
}

export default OntologyUsage
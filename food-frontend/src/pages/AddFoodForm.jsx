import { useState } from 'react'
import { PlusCircle, X, Loader2, CheckCircle2 } from 'lucide-react'
import { createFood } from '../services/api'

function AddFoodForm() {
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    glycemicIndex: '',
    region: ''
  })

  const [preventsList, setPreventsList] = useState([])
  const [worsensList, setWorsensList] = useState([])
  const [preventsInput, setPreventsInput] = useState('')
  const [worsensInput, setWorsensInput] = useState('')

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', message: '' }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function addToList(value, setValue, list, setList) {
    const trimmed = value.trim()
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed])
    }
    setValue('')
  }

  function removeFromList(item, list, setList) {
    setList(list.filter((i) => i !== item))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      const payload = {
        id: formData.id.trim(),
        label: formData.label.trim(),
        glycemicIndex: formData.glycemicIndex ? Number(formData.glycemicIndex) : undefined,
        region: formData.region.trim() || undefined,
        prevents: preventsList.length > 0 ? preventsList : undefined,
        worsens: worsensList.length > 0 ? worsensList : undefined
      }

      const result = await createFood(payload)
      setFeedback({ type: 'success', message: result.message })

      // Réinitialise le formulaire après succès
      setFormData({ id: '', label: '', glycemicIndex: '', region: '' })
      setPreventsList([])
      setWorsensList([])
    } catch (err) {
      setFeedback({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold text-center mb-2">Ajouter un aliment</h1>
      <p className="text-center text-base-content/70 mb-8">
        Enrichissez l'ontologie avec un nouvel aliment et ses relations.
      </p>

      <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-300 shadow-sm p-6 space-y-5">

        {/* Identifiant */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Identifiant *</span>
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="ex: Ndole (sans espace ni accent particulier)"
            className="input input-bordered w-full"
            required
          />
          <p className="text-xs text-base-content/50 mt-1">
            Lettres et chiffres uniquement, doit commencer par une lettre.
          </p>
        </div>

        {/* Label affiché */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Nom affiché *</span>
          </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="ex: Ndolé"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Index glycémique + région côte à côte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Index glycémique</span>
            </label>
            <input
              type="number"
              name="glycemicIndex"
              value={formData.glycemicIndex}
              onChange={handleChange}
              placeholder="ex: 35"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text font-medium">Région</span>
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="ex: Centre"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Liste : maladies prévenues */}
        <TagListInput
          label="Maladies prévenues"
          inputValue={preventsInput}
          setInputValue={setPreventsInput}
          list={preventsList}
          onAdd={() => addToList(preventsInput, setPreventsInput, preventsList, setPreventsList)}
          onRemove={(item) => removeFromList(item, preventsList, setPreventsList)}
          placeholder="ex: Diabetes"
          badgeClass="badge-success"
        />

        {/* Liste : maladies aggravées */}
        <TagListInput
          label="Maladies aggravées"
          inputValue={worsensInput}
          setInputValue={setWorsensInput}
          list={worsensList}
          onAdd={() => addToList(worsensInput, setWorsensInput, worsensList, setWorsensList)}
          onRemove={(item) => removeFromList(item, worsensList, setWorsensList)}
          placeholder="ex: Obesity"
          badgeClass="badge-error"
        />

        {/* Bouton de soumission */}
        <button type="submit" disabled={loading} className="btn btn-primary w-full gap-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
          {loading ? 'Ajout en cours...' : "Ajouter à l'ontologie"}
        </button>

        {/* Message de retour */}
        {feedback && (
          <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {feedback.type === 'success' && <CheckCircle2 size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

      </form>
    </div>
  )
}

/**
 * Petit sous-composant réutilisable pour les champs "liste de tags"
 * (utilisé pour prevents et worsens)
 */
function TagListInput({ label, inputValue, setInputValue, list, onAdd, onRemove, placeholder, badgeClass }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      onAdd()
    }
  }

  return (
    <div>
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input input-bordered flex-1"
        />
        <button type="button" onClick={onAdd} className="btn btn-outline">
          Ajouter
        </button>
      </div>

      {list.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {list.map((item) => (
            <span key={item} className={`badge ${badgeClass} gap-1`}>
              {item}
              <button type="button" onClick={() => onRemove(item)} aria-label={`Retirer ${item}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddFoodForm
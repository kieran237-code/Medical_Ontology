import { Loader2, Terminal } from 'lucide-react'

function ResultTerminal({ loading, content }) {
  return (
    <div className="bg-neutral text-neutral-content rounded-xl shadow-inner overflow-hidden">

      {/* Barre de titre façon terminal */}
      <div className="flex items-center gap-2 px-4 py-2 bg-neutral-content/10 border-b border-neutral-content/10">
        <Terminal size={16} />
        <span className="text-xs font-mono opacity-70">resultats@foodhealth ~ </span>
      </div>

      {/* Zone de contenu */}
      <div className="p-5 font-mono text-sm min-h-[180px] whitespace-pre-wrap leading-relaxed">
        {loading ? (
          <div className="flex items-center gap-2 opacity-80">
            <Loader2 size={16} className="animate-spin" />
            <span>Recherche dans l'ontologie en cours...</span>
          </div>
        ) : content ? (
          content
        ) : (
          <span className="opacity-40">
            &gt; En attente d'une recherche...
          </span>
        )}
      </div>

    </div>
  )
}

export default ResultTerminal
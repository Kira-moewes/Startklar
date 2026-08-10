import { Link } from 'react-router-dom'
import { tools } from '../data/tools'

export default function Tools() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-12">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine">Tools</h1>
        <p className="mt-2 text-lg text-ink/80">
          Kleine Helfer für schnelle Antworten. Alles läuft auf deinem Gerät — deine Daten sind sicher.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map(tool => (
          <Link
            key={tool.id}
            to={`/tools/${tool.id}`}
            className="group block rounded-card bg-cream-card border border-pine-mist p-6 hover:border-coral transition"
          >
            <p className="text-xs font-semibold tracking-widest text-ink/60 uppercase mb-2">
              {tool.category === 'steuern' && 'Steuern'}
              {tool.category === 'geld' && 'Geld'}
              {tool.category === 'versicherung' && 'Versicherung'}
              {tool.category === 'mobilitaet' && 'Mobilität'}
              {tool.category === 'beruf' && 'Beruf'}
            </p>
            <h2 className="font-display text-2xl font-semibold text-pine group-hover:text-coral transition">
              {tool.title}
            </h2>
            <p className="mt-3 text-ink/80">{tool.teaser}</p>
            <p className="mt-4 font-display font-semibold text-coral">Ausprobieren →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

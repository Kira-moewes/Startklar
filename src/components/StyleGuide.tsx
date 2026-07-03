export default function StyleGuide() {
  return (
    <main className="min-h-screen bg-cream px-6 py-16 text-ink">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 rounded-card bg-cream-card p-8 shadow-sm ring-1 ring-pine/10">
        <div className="text-center">
          <p className="mb-3 inline-flex rounded-pill bg-pine-soft/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-pine-soft">
            Design system
          </p>
          <h1 className="font-display text-4xl font-semibold text-pine sm:text-5xl">
            Startklar design tokens
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/80">
            A compact preview of the palette, typography, and surface styles used throughout the interface.
          </p>
        </div>

        <section className="grid w-full gap-4 md:grid-cols-2">
          <div className="rounded-card border border-pine/10 bg-white/70 p-6">
            <h2 className="font-display text-xl font-semibold text-pine">Color palette</h2>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between rounded-field bg-pine px-4 py-3 text-cream">
                <span>Pine</span>
                <span className="text-sm opacity-80">#1B3931</span>
              </div>
              <div className="flex items-center justify-between rounded-field bg-coral px-4 py-3 text-cream">
                <span>Coral</span>
                <span className="text-sm opacity-80">#F47B5B</span>
              </div>
              <div className="flex items-center justify-between rounded-field bg-pine-soft px-4 py-3 text-cream">
                <span>Pine soft</span>
                <span className="text-sm opacity-80">#2C4F45</span>
              </div>
              <div className="flex items-center justify-between rounded-field bg-pine-mist px-4 py-3 text-ink">
                <span>Pine mist</span>
                <span className="text-sm opacity-70">#E4EAE7</span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-pine/10 bg-white/70 p-6">
            <h2 className="font-display text-xl font-semibold text-pine">Typography & surfaces</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-field border border-pine/10 bg-cream-card p-4">
                <p className="font-display text-2xl font-semibold text-pine">Display heading</p>
                <p className="mt-2 text-sm text-ink/70">Body copy uses the Inter Variable font and reads comfortably on cream backgrounds.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-pill bg-coral px-4 py-2 font-semibold text-cream transition hover:bg-coral-deep">
                  Primary action
                </button>
                <button className="rounded-pill border border-pine/20 bg-transparent px-4 py-2 font-semibold text-pine">
                  Secondary action
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

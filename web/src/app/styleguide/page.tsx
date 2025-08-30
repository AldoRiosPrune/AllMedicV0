import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styleguide | UI Base",
};

export default function Page() {
  return (
    <main id="styleguide" style={{ padding: "32px 24px" }}>
      <h1>Styleguide</h1>

      <p className="lead">
        Componentes base y estados: normal, hover, disabled y error.
      </p>

      <section aria-labelledby="buttons-heading">
        <h2 id="buttons-heading">Botones</h2>

        <div className="grid">
          <div className="item">
            <div className="label">Normal</div>
            <button className="btn primary">Primario</button>
          </div>
          <div className="item">
            <div className="label">Hover</div>
            <button className="btn primary is-hover" aria-label="Primario hover">
              Primario
            </button>
          </div>
          <div className="item">
            <div className="label">Disabled</div>
            <button className="btn primary" disabled>
              Inactivo
            </button>
          </div>
          <div className="item">
            <div className="label">Error</div>
            <button className="btn error">Error</button>
          </div>
        </div>
      </section>

      <section aria-labelledby="inputs-heading">
        <h2 id="inputs-heading">Inputs</h2>

        <div className="grid">
          <div className="item">
            <label className="label" htmlFor="name-normal">
              Normal
            </label>
            <input
              id="name-normal"
              className="input"
              placeholder="Texto"
              aria-label="Input normal"
            />
          </div>

          <div className="item">
            <label className="label" htmlFor="name-hover">
              Hover
            </label>
            <input
              id="name-hover"
              className="input is-hover"
              placeholder="Pasar cursor"
              aria-label="Input hover"
            />
          </div>

          <div className="item">
            <label className="label" htmlFor="name-disabled">
              Disabled
            </label>
            <input
              id="name-disabled"
              className="input"
              placeholder="Inactivo"
              disabled
              aria-disabled="true"
            />
          </div>

          <div className="item">
            <label className="label" htmlFor="name-error">
              Error
            </label>
            <input
              id="name-error"
              className="input error"
              placeholder="Con error"
              aria-invalid="true"
            />
            <p className="hint error">Este campo es requerido</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="selects-heading">
        <h2 id="selects-heading">Selects</h2>

        <div className="grid">
          <div className="item">
            <label className="label" htmlFor="sel-normal">
              Normal
            </label>
            <select id="sel-normal" className="select" aria-label="Select normal">
              <option>Opcin A</option>
              <option>Opcin B</option>
              <option>Opcin C</option>
            </select>
          </div>

          <div className="item">
            <label className="label" htmlFor="sel-hover">
              Hover
            </label>
            <select id="sel-hover" className="select is-hover" aria-label="Select hover">
              <option>Opcin A</option>
              <option>Opcin B</option>
              <option>Opcin C</option>
            </select>
          </div>

          <div className="item">
            <label className="label" htmlFor="sel-disabled">
              Disabled
            </label>
            <select id="sel-disabled" className="select" disabled aria-disabled="true">
              <option>Opcin A</option>
              <option>Opcin B</option>
            </select>
          </div>

          <div className="item">
            <label className="label" htmlFor="sel-error">
              Error
            </label>
            <select id="sel-error" className="select error" aria-invalid="true">
              <option>Opcin A</option>
              <option>Opcin B</option>
              <option>Opcin C</option>
            </select>
            <p className="hint error">Selecciona una opcin vlida</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="cards-heading">
        <h2 id="cards-heading">Cards</h2>

        <div className="grid">
          <div className="item">
            <div className="label">Normal</div>
            <article className="card">
              <h3 className="card-title">Ttulo card</h3>
              <p className="card-text">
                Contenido breve. Esta es una tarjeta en estado normal.
              </p>
              <button className="btn secondary">Accin</button>
            </article>
          </div>

          <div className="item">
            <div className="label">Hover</div>
            <article className="card is-hover" aria-label="Card hover">
              <h3 className="card-title">Ttulo card</h3>
              <p className="card-text">
                Al pasar el cursor, resalta el borde y la sombra.
              </p>
              <button className="btn secondary">Accin</button>
            </article>
          </div>

          <div className="item">
            <div className="label">Disabled</div>
            <article className="card disabled">
              <h3 className="card-title">Ttulo card</h3>
              <p className="card-text">Estado inactivo con interaccin bloqueada.</p>
              <button className="btn secondary" disabled>
                Accin
              </button>
            </article>
          </div>

          <div className="item">
            <div className="label">Error</div>
            <article className="card error">
              <h3 className="card-title">Ttulo card</h3>
              <p className="card-text">Ocurri un error en esta tarjeta.</p>
              <button className="btn error">Reintentar</button>
            </article>
          </div>
        </div>
      </section>

      <style>{`
        /* Variables locales */
        #styleguide {
          --fg: #0f172a;
          --muted: #64748b;
          --border: #e2e8f0;
          --surface: #f8fafc;
          --card-bg: #ffffff;
          --card-border: #e5e7eb;
          --accent: #3b82f6;
          --accent-hover: #2563eb;
          --error: #ef4444;
          --error-hover: #dc2626;
          color: var(--fg);
          background: var(--surface);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          line-height: 1.4;
        }

        #styleguide h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px;
        }

        #styleguide .lead {
          margin: 0 0 24px;
          color: var(--muted);
        }

        #styleguide section {
          margin: 28px 0 8px;
        }

        #styleguide h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 14px;
        }

        #styleguide .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        #styleguide .item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
        }

        #styleguide .label {
          font-size: 12px;
          color: var(--muted);
        }

        /* Botones */
        #styleguide .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          font-weight: 600;
          font-size: 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--fg);
          transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, color 120ms ease;
          cursor: pointer;
        }

        #styleguide .btn.secondary:hover {
          border-color: var(--accent);
          box-shadow: 0 1px 0 0 rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.06);
        }

        #styleguide .btn.primary {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }

        #styleguide .btn.primary:hover,
        #styleguide .btn.primary.is-hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
        }

        #styleguide .btn.error {
          background: var(--error);
          border-color: var(--error);
          color: #fff;
        }

        #styleguide .btn.error:hover,
        #styleguide .btn.error.is-hover {
          background: var(--error-hover);
          border-color: var(--error-hover);
        }

        #styleguide .btn:disabled,
        #styleguide .card.disabled .btn {
          background: #f1f5f9;
          color: #94a3b8;
          border-color: #e2e8f0;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Inputs */
        #styleguide .input,
        #styleguide .select {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--fg);
          outline: none;
          transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
          appearance: none;
        }

        #styleguide .input:hover,
        #styleguide .select:hover,
        #styleguide .input.is-hover,
        #styleguide .select.is-hover {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        #styleguide .input:focus,
        #styleguide .select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.25);
        }

        #styleguide .input:disabled,
        #styleguide .select:disabled {
          background: #f1f5f9;
          color: #94a3b8;
          border-color: #e2e8f0;
          cursor: not-allowed;
        }

        #styleguide .input.error,
        #styleguide .select.error {
          border-color: var(--error);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
        }

        #styleguide .hint {
          margin: 6px 2px 0;
          font-size: 12px;
          color: var(--muted);
        }

        #styleguide .hint.error {
          color: var(--error);
        }

        /* Cards */
        #styleguide .card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          border: 1px solid var(--card-border);
          border-radius: 12px;
          background: var(--card-bg);
          transition: border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
        }

        #styleguide .card:hover,
        #styleguide .card.is-hover {
          border-color: var(--accent);
          box-shadow: 0 6px 18px rgba(2,6,23,0.08);
        }

        #styleguide .card.disabled {
          opacity: 0.6;
          pointer-events: none;
          filter: grayscale(0.1);
        }

        #styleguide .card.error {
          border-color: var(--error);
          box-shadow: 0 6px 18px rgba(239,68,68,0.12);
        }

        #styleguide .card-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        #styleguide .card-text {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}






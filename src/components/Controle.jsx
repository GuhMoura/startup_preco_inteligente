// Controle deslizante com rótulo e valor formatado.
export function Controle({ id, rotulo, valor, min, max, passo, formatar, onChange, ajuda }) {
  const p = ((valor - min) / (max - min)) * 100;
  return (
    <div className="controle">
      <div className="controle__topo">
        <label htmlFor={id}>{rotulo}</label>
        <output htmlFor={id}>{formatar(valor)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        style={{ '--p': `${p}%` }}
        aria-valuetext={formatar(valor)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {ajuda && <small>{ajuda}</small>}
    </div>
  );
}

// Grupo de botões para escolher uma opção (cenário, plano).
export function Escolha({ rotulo, opcoes, valor, onChange }) {
  return (
    <div className="controle">
      <div className="controle__topo">
        <span className="controle__rotulo">{rotulo}</span>
      </div>
      <div className="escolha" role="group" aria-label={rotulo}>
        {opcoes.map((o) => (
          <button key={o.id} type="button" aria-pressed={o.id === valor} onClick={() => onChange(o.id)}>
            {o.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}

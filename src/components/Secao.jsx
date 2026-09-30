export function Secao({ id, n, rotulo, titulo, lead, variante, children }) {
  return (
    <section id={id} className={variante ? `secao secao--${variante}` : 'secao'} aria-labelledby={`${id}-titulo`}>
      <div className="largura">
        <header className="cabecalho">
          <span className="sobretitulo">
            <span className="sobretitulo__n">{n}</span>
            {rotulo}
          </span>
          <h2 id={`${id}-titulo`}>{titulo}</h2>
          {lead && <p className="lead">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

export function Subtitulo({ titulo, children }) {
  return (
    <div className="subtitulo">
      <h3>{titulo}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}

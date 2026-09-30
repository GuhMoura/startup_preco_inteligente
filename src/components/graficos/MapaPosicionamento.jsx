import { useLargura } from '../../hooks/useLargura.js';

// Mapa perceptual: dois eixos cruzando no centro, concorrentes em cinza e nós em laranja.
export function MapaPosicionamento({ mapa }) {
  const [ref, w] = useLargura(340);
  const lado = Math.min(w, 420);
  const pad = 30;
  const x = (v) => pad + (v / 100) * (lado - pad * 2);
  const y = (v) => pad + (1 - v / 100) * (lado - pad * 2);
  const meio = lado / 2;

  return (
    <figure className="mapa" ref={ref} style={{ margin: 0 }}>
      <svg width={lado} height={lado} role="img" aria-label={`${mapa.descricao}. ${mapa.pontos.map((p) => p.nome).join(', ')}.`}>
        <rect x="0.5" y="0.5" width={lado - 1} height={lado - 1} rx="14" fill="var(--paper)" stroke="var(--line)" />
        <line x1={pad - 8} x2={lado - pad + 8} y1={meio} y2={meio} stroke="var(--line)" strokeWidth="1.5" />
        <line x1={meio} x2={meio} y1={pad - 8} y2={lado - pad + 8} stroke="var(--line)" strokeWidth="1.5" />

        <text x={8} y={meio - 8} fontSize="11.5" fontWeight="700" fill="var(--muted)">
          {mapa.eixoX[0]}
        </text>
        <text x={lado - 8} y={meio - 8} textAnchor="end" fontSize="11.5" fontWeight="700" fill="var(--muted)">
          {mapa.eixoX[1]}
        </text>
        <text x={meio + 8} y={18} fontSize="11.5" fontWeight="700" fill="var(--muted)">
          {mapa.eixoY[1]}
        </text>
        <text x={meio + 8} y={lado - 10} fontSize="11.5" fontWeight="700" fill="var(--muted)">
          {mapa.eixoY[0]}
        </text>

        {mapa.pontos.map((p) => {
          const aDireita = p.x < 62;
          const cx = x(p.x);
          const cy = y(p.y);
          return (
            <g key={p.nome}>
              {p.nos && <circle cx={cx} cy={cy} r="17" fill="var(--amber)" opacity="0.14" />}
              <circle
                cx={cx}
                cy={cy}
                r={p.nos ? 8 : 5.5}
                fill={p.nos ? 'var(--amber)' : 'var(--slate)'}
                stroke="var(--paper)"
                strokeWidth="2"
              />
              <text
                x={aDireita ? cx + (p.nos ? 14 : 10) : cx - (p.nos ? 14 : 10)}
                y={cy + 4.5}
                textAnchor={aDireita ? 'start' : 'end'}
                fontSize={p.nos ? 13.5 : 12.5}
                fontWeight={p.nos ? 700 : 500}
                fill={p.nos ? 'var(--ink)' : 'var(--ink-2)'}
              >
                {p.nome}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>{mapa.descricao}</figcaption>
    </figure>
  );
}

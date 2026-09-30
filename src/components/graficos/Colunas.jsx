import { useLargura } from '../../hooks/useLargura.js';

// Coluna com a ponta de dados arredondada e a base reta (aceita valor negativo).
function coluna(xc, y0, y1, espessura, raio = 4) {
  const l = xc - espessura / 2;
  const d = xc + espessura / 2;
  const sobe = y1 < y0;
  const r = Math.min(raio, Math.abs(y1 - y0) / 2, espessura / 2);
  if (sobe) {
    return `M${l},${y0} V${y1 + r} Q${l},${y1} ${l + r},${y1} H${d - r} Q${d},${y1} ${d},${y1 + r} V${y0} Z`;
  }
  return `M${l},${y0} V${y1 - r} Q${l},${y1} ${l + r},${y1} H${d - r} Q${d},${y1} ${d},${y1 - r} V${y0} Z`;
}

// Gráfico de colunas simples, um valor por ano. `cor` pode ser função do valor.
export function Colunas({ dados, cor, formatar, rotulo, altura = 230 }) {
  const [ref, w] = useLargura(420);
  const valores = dados.map((d) => d.valor);
  const maior = Math.max(0, ...valores);
  const menor = Math.min(0, ...valores);
  // espaço extra embaixo para o rótulo das colunas negativas
  const m = { topo: 26, base: menor < 0 ? 50 : 30, lados: 8 };
  const faixa = maior - menor || 1;
  const y = (v) => m.topo + ((maior - v) / faixa) * (altura - m.topo - m.base);
  const banda = (w - m.lados * 2) / dados.length;
  const espessura = Math.min(24, banda * 0.5);
  const xc = (i) => m.lados + banda * i + banda / 2;

  return (
    <div className="grafico" ref={ref}>
      <svg width={w} height={altura} role="img" aria-label={`${rotulo}: ${dados.map((d) => `${d.rotulo} ${formatar(d.valor)}`).join('; ')}`}>
        <line x1={m.lados} x2={w - m.lados} y1={y(0)} y2={y(0)} stroke="var(--ink-2)" strokeWidth="1" />
        {dados.map((d, i) => {
          const negativo = d.valor < 0;
          const preenchimento = typeof cor === 'function' ? cor(d.valor) : cor;
          return (
            <g key={d.rotulo}>
              {d.valor !== 0 && <path d={coluna(xc(i), y(0), y(d.valor), espessura)} fill={preenchimento} />}
              <text
                x={xc(i)}
                y={negativo ? y(d.valor) + 16 : y(d.valor) - 8}
                textAnchor="middle"
                fontSize="12.5"
                fontWeight="700"
                fill="var(--ink)"
                className="num"
              >
                {formatar(d.valor)}
              </text>
              <text x={xc(i)} y={altura - 8} textAnchor="middle" fontSize="12" fill="var(--muted)">
                {d.rotulo}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

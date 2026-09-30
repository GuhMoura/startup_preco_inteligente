import { useState } from 'react';
import { useLargura } from '../../hooks/useLargura.js';
import { multiplo, reais0, reaisCompacto } from '../../lib/formato.js';

// Barra horizontal com a ponta de dados arredondada e a base reta.
function barra(x0, x1, yc, espessura, raio = 4) {
  const r = Math.min(raio, (x1 - x0) / 2, espessura / 2);
  const t = yc - espessura / 2;
  const b = yc + espessura / 2;
  return `M${x0},${t} H${x1 - r} Q${x1},${t} ${x1},${t + r} V${b - r} Q${x1},${b} ${x1 - r},${b} H${x0} Z`;
}

// Quanto o valor investido vira no fim do horizonte, em cada alternativa.
export function BarrasCenarios({ itens, investido }) {
  const [ref, w] = useLargura(640);
  const [ativo, setAtivo] = useState(null);

  const compacto = w < 560;
  const esquerda = compacto ? 0 : 150;
  const direita = compacto ? 84 : 104;
  const alturaLinha = compacto ? 58 : 48;
  const topo = 26;
  const altura = topo + itens.length * alturaLinha + 6;
  const maior = Math.max(...itens.map((i) => i.valor), investido);
  const x = (v) => esquerda + (v / maior) * (w - esquerda - direita);
  const yCentro = (i) => topo + i * alturaLinha + (compacto ? 38 : alturaLinha / 2);

  return (
    <div className="grafico" ref={ref}>
      <svg
        width={w}
        height={altura}
        role="img"
        aria-label={itens.map((i) => `${i.rotulo}: ${reais0(i.valor)}`).join('; ')}
        onMouseLeave={() => setAtivo(null)}
      >
        <line x1={x(investido)} x2={x(investido)} y1={topo - 8} y2={topo - 2} stroke="var(--ink-2)" strokeWidth="1" />
        <text
          x={x(investido)}
          y={topo - 12}
          textAnchor={x(investido) < esquerda + 60 ? 'start' : 'middle'}
          fontSize="11.5"
          fontWeight="600"
          fill="var(--ink-2)"
        >
          Você investiu {reaisCompacto(investido)}
        </text>

        {itens.map((item, i) => {
          const yc = yCentro(i);
          const cor = item.tipo === 'cdi' ? 'var(--slate)' : item.ativo ? 'var(--amber)' : 'var(--amber-soft)';
          return (
            <g
              key={item.rotulo}
              onMouseEnter={() => setAtivo(i)}
              opacity={ativo === null || ativo === i ? 1 : 0.55}
            >
              <rect x={0} y={topo + i * alturaLinha} width={w} height={alturaLinha} fill="transparent" />
              <text
                x={compacto ? 0 : esquerda - 14}
                y={compacto ? yc - 16 : yc + 5}
                textAnchor={compacto ? 'start' : 'end'}
                fontSize="14"
                fontWeight={item.ativo || item.tipo === 'cdi' ? 700 : 500}
                fill="var(--ink)"
              >
                {item.rotulo}
              </text>
              <path d={barra(x(0), Math.max(x(item.valor), x(0) + 2), yc, 22)} fill={cor} />
              {/* marca do valor investido, só na altura da barra para não riscar os rótulos */}
              <line x1={x(investido)} x2={x(investido)} y1={yc - 14} y2={yc + 14} stroke="var(--ink-2)" strokeWidth="1.5" />
              <text x={Math.max(x(item.valor), x(0) + 2) + 8} y={yc - 1} fontSize="14" fontWeight="700" fill="var(--ink)" className="num">
                {reaisCompacto(item.valor)}
              </text>
              <text x={Math.max(x(item.valor), x(0) + 2) + 8} y={yc + 14} fontSize="11.5" fill="var(--muted)" className="num">
                {multiplo(item.valor / investido)} o valor
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

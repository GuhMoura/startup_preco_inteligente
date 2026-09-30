import { useState } from 'react';
import { useLargura } from '../../hooks/useLargura.js';
import { pct, reais } from '../../lib/formato.js';

// Faixa de preço (menor → maior) com a mediana, uma linha por cidade.
export function FaixaCidades({ dados }) {
  const [ref, w] = useLargura(720);
  const [ativo, setAtivo] = useState(null);

  const linhas = dados
    .map((d) => ({ ...d, diferenca: d.max / d.min - 1 }))
    .sort((a, b) => b.diferenca - a.diferenca);

  const compacto = w < 600;
  const alturaLinha = compacto ? 52 : 36;
  const esquerda = compacto ? 4 : 176;
  const direita = 64;
  const topo = compacto ? 8 : 30;
  const alturaEixo = 30;
  const altura = topo + linhas.length * alturaLinha + alturaEixo;

  const dominio = [75, 158];
  const x = (v) => esquerda + ((v - dominio[0]) / (dominio[1] - dominio[0])) * (w - esquerda - direita);
  const marcas = compacto ? [80, 100, 120, 140] : [80, 90, 100, 110, 120, 130, 140, 150];
  const yCentro = (i) => topo + i * alturaLinha + (compacto ? 34 : alturaLinha / 2);

  const linhaAtiva = ativo === null ? null : linhas[ativo];

  return (
    <div className="grafico" ref={ref}>
      <div className="legenda" aria-hidden="true">
        <span>
          <i className="faixa" style={{ background: 'var(--teal-soft)' }} />
          Do menor ao maior preço
        </span>
        <span>
          <i style={{ background: 'var(--teal)' }} />
          Preço mediano
        </span>
        <span>Número à direita: diferença entre o maior e o menor</span>
      </div>
      <svg
        width={w}
        height={altura}
        role="img"
        aria-label="Faixa de preço do botijão de 13 kg nas 12 cidades paulistas com mais coletas, de janeiro a agosto de 2026."
        onMouseLeave={() => setAtivo(null)}
      >
        {marcas.map((m) => (
          <g key={m}>
            <line x1={x(m)} x2={x(m)} y1={topo - 6} y2={altura - alturaEixo + 4} stroke="var(--line)" strokeWidth="1" />
            <text x={x(m)} y={altura - 8} textAnchor="middle" fontSize="12" fill="var(--muted)" className="num">
              R$ {m}
            </text>
          </g>
        ))}
        {!compacto && (
          <text x={w - direita + 12} y={topo - 10} fontSize="11" fontWeight="700" fill="var(--muted)" letterSpacing="0.06em">
            DIFERENÇA
          </text>
        )}

        {linhas.map((d, i) => {
          const yc = yCentro(i);
          const destaque = ativo === i;
          return (
            <g
              key={d.cidade}
              tabIndex={0}
              aria-label={`${d.cidade}: de ${reais(d.min)} a ${reais(d.max)}, mediana ${reais(d.mediana)}, diferença de ${pct(d.diferenca)}`}
              onMouseEnter={() => setAtivo(i)}
              onFocus={() => setAtivo(i)}
              onBlur={() => setAtivo(null)}
              style={{ outline: 'none' }}
            >
              <rect
                x={0}
                y={topo + i * alturaLinha}
                width={w}
                height={alturaLinha}
                fill={destaque ? 'var(--teal-tint)' : 'transparent'}
                rx="6"
              />
              {compacto ? (
                <text x={esquerda} y={yc - 14} fontSize="13" fontWeight="600" fill="var(--ink)">
                  {d.cidade}
                </text>
              ) : (
                <text x={esquerda - 14} y={yc + 4.5} textAnchor="end" fontSize="14" fontWeight="600" fill="var(--ink)">
                  {d.cidade}
                </text>
              )}
              <rect x={x(d.min)} y={yc - 4} width={x(d.max) - x(d.min)} height="8" rx="4" fill="var(--teal-soft)" />
              <circle cx={x(d.mediana)} cy={yc} r="6" fill="var(--teal)" stroke="var(--paper)" strokeWidth="2" />
              {i === 0 && !compacto && (
                <>
                  <text x={x(d.min)} y={yc - 9} fontSize="12" fill="var(--ink-2)" className="num">
                    {reais(d.min)}
                  </text>
                  <text x={x(d.max)} y={yc - 9} textAnchor="end" fontSize="12" fill="var(--ink-2)" className="num">
                    {reais(d.max)}
                  </text>
                </>
              )}
              <text
                x={w - 4}
                y={yc + 5}
                textAnchor="end"
                fontSize="14"
                fontWeight="700"
                fill="var(--ink)"
                className="num"
              >
                {pct(d.diferenca)}
              </text>
            </g>
          );
        })}
      </svg>

      {linhaAtiva && (
        <div
          className="dica"
          style={{
            left: Math.max(0, Math.min(x(linhaAtiva.mediana) - 100, w - 240)),
            top: yCentro(ativo) + 14,
          }}
        >
          <strong>{linhaAtiva.cidade}</strong>
          <dl>
            <dt>Menor preço</dt>
            <dd>{reais(linhaAtiva.min)}</dd>
            <dt>Mediana</dt>
            <dd>{reais(linhaAtiva.mediana)}</dd>
            <dt>Maior preço</dt>
            <dd>{reais(linhaAtiva.max)}</dd>
            <dt>Diferença</dt>
            <dd>{pct(linhaAtiva.diferenca)}</dd>
            <dt>Coletas</dt>
            <dd>{linhaAtiva.coletas.toLocaleString('pt-BR')}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}

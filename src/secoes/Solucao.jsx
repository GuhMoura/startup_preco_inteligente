import { Etiqueta } from '../components/Etiqueta.jsx';
import { Icone } from '../components/Icone.jsx';
import { Secao, Subtitulo } from '../components/Secao.jsx';
import { DIAGNOSTICO_EXEMPLO, MAPA_DE_VALOR, MODULOS, PASSOS, PROMESSA } from '../data/conteudo.js';
import { reais } from '../lib/formato.js';

const STATUS = {
  abaixo: { rotulo: 'Abaixo da região', icone: 'descer', classe: 'status--abaixo' },
  faixa: { rotulo: 'Na faixa', icone: 'igual', classe: 'status--faixa' },
  acima: { rotulo: 'Acima da região', icone: 'subir', classe: 'status--acima' },
};

function statusDe(item) {
  if (item.seu < item.min) return 'abaixo';
  if (item.seu > item.max) return 'acima';
  return 'faixa';
}

// Mini faixa da região: barra do menor ao maior, traço na mediana e ponto no preço da loja.
function FaixaMini({ item, status }) {
  const w = 150;
  const lo = Math.min(item.seu, item.min);
  const hi = Math.max(item.seu, item.max);
  const folga = (hi - lo) * 0.08;
  const x = (v) => 6 + ((v - (lo - folga)) / (hi - lo + folga * 2)) * (w - 12);
  const cor = status === 'faixa' ? 'var(--teal)' : status === 'abaixo' ? 'var(--amber)' : 'var(--bad)';
  return (
    <svg width={w} height="22" aria-hidden="true" style={{ display: 'block' }}>
      <rect x={x(item.min)} y="8" width={x(item.max) - x(item.min)} height="6" rx="3" fill="var(--teal-soft)" />
      <rect x={x(item.mediana) - 1} y="5" width="2" height="12" rx="1" fill="var(--teal-ink)" />
      <circle cx={x(item.seu)} cy="11" r="5.5" fill={cor} stroke="var(--paper)" strokeWidth="2" />
    </svg>
  );
}

function PainelDiagnostico() {
  const linhas = DIAGNOSTICO_EXEMPLO.map((item) => {
    const status = statusDe(item);
    const impacto = status === 'abaixo' ? (item.sugestao - item.seu) * item.unidadesMes : null;
    return { ...item, status, impacto };
  });
  const total = linhas.reduce((s, l) => s + (l.impacto ?? 0), 0);

  return (
    <div className="painel">
      <div className="painel__barra">
        <strong>Diagnóstico da semana · Mercadinho exemplo</strong>
        <span>Exemplo ilustrativo. A linha do botijão usa a faixa real da cidade de São Paulo (ANP).</span>
      </div>
      <p className="painel__dica">Arraste a tabela para o lado para ver todas as colunas.</p>
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th className="n">Seu preço</th>
              <th>Faixa da região</th>
              <th>Situação</th>
              <th>Sugestão</th>
              <th className="n">Efeito por mês</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => {
              const s = STATUS[l.status];
              return (
                <tr key={l.produto}>
                  <td className="painel__produto">
                    {l.produto}
                    {l.real && <small>Dado real ANP</small>}
                  </td>
                  <td className="n">{reais(l.seu)}</td>
                  <td>
                    <FaixaMini item={l} status={l.status} />
                    <span className="nota num" style={{ fontSize: '0.75rem' }}>
                      {reais(l.min)} a {reais(l.max)}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${s.classe}`}>
                      <Icone nome={s.icone} tamanho={16} />
                      {s.rotulo}
                    </span>
                  </td>
                  <td>{l.sugestao ? <Etiqueta valor={l.sugestao} mini /> : <span className="nota">Manter</span>}</td>
                  <td className="n">
                    {l.impacto !== null ? (
                      <strong>+{reais(l.impacto)}</strong>
                    ) : l.status === 'acima' ? (
                      <span className="nota">perde cliente</span>
                    ) : (
                      <span className="nota">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>Margem recuperada por mês só nos itens abaixo da região</td>
              <td className="n">+{reais(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function Solucao() {
  return (
    <Secao
      id="solucao"
      n="03"
      rotulo="A solução"
      titulo="Preço da região, custo real e margem em um só lugar"
      lead="Uma plataforma web que compara o preço de cada produto com o que a vizinhança cobra e com o quanto ele custa de verdade para a loja. O dono ajusta em minutos, com a justificativa em uma linha, e vê o resultado em reais."
      variante="alt"
    >
      <div className="promessa">
        <small>A promessa</small>
        <p>{PROMESSA}</p>
      </div>

      <div className="bloco">
        <Subtitulo titulo="Cada dor tem uma resposta">
          Cada recurso da plataforma existe porque existe uma dor do cliente. Esse encaixe é a proposta de valor.
        </Subtitulo>
        <div className="encaixe">
          <div className="encaixe__cabeca">
            <span>Dor do cliente</span>
            <span />
            <span>O que a plataforma faz</span>
          </div>
          {MAPA_DE_VALOR.map((m) => (
            <div key={m.dor} className="encaixe__linha">
              <div className="encaixe__dor">{m.dor}</div>
              <span className="encaixe__seta">
                <Icone nome="seta" tamanho={22} />
              </span>
              <div className="encaixe__recurso">{m.recurso}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bloco">
        <Subtitulo titulo="Como funciona">Implantação em três passos, sem taxa de instalação e sem equipamento.</Subtitulo>
        <ol className="passos">
          {PASSOS.map((p) => (
            <li key={p.titulo}>
              <h4>{p.titulo}</h4>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="bloco">
        <Subtitulo titulo="O que o dono recebe toda semana">
          A lista de itens fora da faixa da região, com a sugestão de preço já em número redondo, pronta para a etiqueta.
        </Subtitulo>
        <PainelDiagnostico />
      </div>

      <div className="bloco">
        <Subtitulo titulo="Os módulos do produto">
          Matriz BCG: onde colocamos o investimento. Como a startup ainda não tem participação de mercado, os módulos
          foram posicionados pela adesão esperada no piloto.
        </Subtitulo>
        <div className="modulos">
          <span className="modulos__eixo-y">Crescimento do mercado →</span>
          {MODULOS.map((m) => (
            <article key={m.nome} className={m.quadrante === 'Estrela' ? 'modulo modulo--estrela' : 'modulo'}>
              <span className={m.quadrante === 'Estrela' ? 'selo selo--amber' : 'selo'}>
                <Icone
                  nome={{ Estrela: 'estrela', Interrogação: 'interrogacao', 'Vaca leiteira': 'cifrao', Abacaxi: 'xis' }[m.quadrante]}
                  tamanho={14}
                />
                {m.quadrante}
              </span>
              <h4>{m.nome}</h4>
              <p>{m.texto}</p>
            </article>
          ))}
          <span className="modulos__eixo-x">← Adesão esperada (alta à esquerda, baixa à direita)</span>
        </div>
      </div>
    </Secao>
  );
}

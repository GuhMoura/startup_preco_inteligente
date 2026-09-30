import { FaixaCidades } from '../components/graficos/FaixaCidades.jsx';
import { Icone } from '../components/Icone.jsx';
import { Secao, Subtitulo } from '../components/Secao.jsx';
import { ACHADOS, CIDADES, CLIENTE, POR_QUE_GAS } from '../data/conteudo.js';
import { pct, reais } from '../lib/formato.js';

export function Problema() {
  return (
    <Secao
      id="problema"
      n="02"
      rotulo="O problema"
      titulo="O problema existe, e nós medimos"
      lead="Analisamos 23.880 preços de gás de cozinha publicados pela ANP no estado de São Paulo. Produto idêntico, mesma cidade, mesma semana, preços diferentes. Não há diferença de mercadoria que explique a variação. O que existe é falta de informação: o comerciante não sabe por quanto o vizinho vende."
    >
      <div className="cartao">
        <div className="grafico__titulo">
          <strong>Quanto custa o mesmo botijão de 13 kg em cada cidade</strong>
          <span>As 12 cidades com mais coletas, janeiro a agosto de 2026. Passe o mouse sobre uma cidade para ver os números.</span>
        </div>
        <FaixaCidades dados={CIDADES} />
        <details className="numeros-grafico">
          <summary>Ver a tabela com os números</summary>
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Cidade</th>
                  <th className="n">Coletas</th>
                  <th className="n">Menor</th>
                  <th className="n">Mediana</th>
                  <th className="n">Maior</th>
                  <th className="n">Diferença</th>
                </tr>
              </thead>
              <tbody>
                {CIDADES.map((c) => (
                  <tr key={c.cidade}>
                    <td>{c.cidade}</td>
                    <td className="n">{c.coletas.toLocaleString('pt-BR')}</td>
                    <td className="n">{reais(c.min)}</td>
                    <td className="n">{reais(c.mediana)}</td>
                    <td className="n">{reais(c.max)}</td>
                    <td className="n">{pct(c.max / c.min - 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      <div className="bloco">
        <Subtitulo titulo="O que os dados mostraram">
          Além da diferença de preço, a análise trouxe quatro achados que sustentam a proposta.
        </Subtitulo>
        <div className="achados">
          {ACHADOS.map((a) => (
            <article key={a.titulo} className="achado">
              <h3>{a.titulo}</h3>
              <p>{a.texto}</p>
            </article>
          ))}
        </div>
      </div>

      <aside className="por-que">
        <p>
          <strong>Por que gás de cozinha, se o cliente é o mercadinho?</strong>
          {POR_QUE_GAS} O mecanismo é o mesmo: a base de produtos do mercadinho vem da integração com o sistema de caixa de
          cada loja.
        </p>
      </aside>

      <div className="bloco">
        <Subtitulo titulo="Quem vive esse problema">{CLIENTE.quem}</Subtitulo>
        <div className="perfil">
          <div className="perfil__coluna">
            <h4>
              <span className="icone-circulo">
                <Icone nome="tarefa" />
              </span>
              O que ele precisa fazer
            </h4>
            <ul>
              {CLIENTE.tarefas.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="perfil__coluna perfil__coluna--dores">
            <h4>
              <span className="icone-circulo icone-circulo--bad">
                <Icone nome="dor" />
              </span>
              O que dói
            </h4>
            <ul>
              {CLIENTE.dores.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="perfil__coluna">
            <h4>
              <span className="icone-circulo icone-circulo--amber">
                <Icone nome="ganho" />
              </span>
              O que ele quer ganhar
            </h4>
            <ul>
              {CLIENTE.ganhos.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Secao>
  );
}

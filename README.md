# Preço Inteligente · site de apresentação

Site em React (Vite) que apresenta a startup **Preço Inteligente** para a banca: o problema medido nos dados da ANP, a solução, a empresa, o mercado, o lucro do dono do mercadinho e o retorno de quem investe, comparado com o CDI.

É uma página única com menu lateral. Cada item do menu leva direto para uma parte do site. Durante a apresentação, as teclas **1 a 8** pulam para cada seção.

| # | Seção | O que mostra |
|---|---|---|
| 1 | Início | A promessa e os números do problema |
| 2 | O problema | Faixa de preço do botijão em 12 cidades, achados da análise e perfil do cliente |
| 3 | A solução | Mapa de valor, como funciona, exemplo do diagnóstico semanal e módulos (BCG) |
| 4 | A empresa | Modelo de negócio, planos e equipe |
| 5 | Mercado | Tamanho do mercado, mapas de posicionamento, SWOT e estratégias |
| 6 | Lucro do mercadinho | Simulador do ganho do dono da loja |
| 7 | Investimento | Simulador CDI × startup, cenários, projeção de 5 anos, uso do dinheiro e riscos |
| 8 | Plano de ação | Linha do tempo, 5W2H e resgate da promessa |

## Como rodar

Precisa do [Node.js](https://nodejs.org) 20 ou mais novo.

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

Outros comandos:

```bash
npm test               # testa o modelo financeiro
npm run build          # gera o site em dist/ (para hospedar)
npm run build:offline  # gera dist-offline/index.html, um arquivo só
```

**Para a apresentação sem internet:** rode `npm run build:offline` e leve o arquivo `dist-offline/index.html` num pendrive. Ele abre com dois cliques em qualquer navegador, com fontes e imagens embutidas.

## Publicar no GitHub Pages

O repositório já tem o workflow `.github/workflows/pages.yml`.

1. No GitHub, abra **Settings → Pages** e, em **Source**, escolha **GitHub Actions**.
2. Faça merge deste branch na `main` (ou rode o workflow manualmente em **Actions → Publicar site no GitHub Pages → Run workflow**).
3. O endereço aparece no resumo do workflow, algo como `https://<usuario>.github.io/startup_preco_inteligente/`.

## Onde mudar os números

Todos os números do modelo ficam em **`src/data/premissas.js`**: CDI, valor captado, participação, planos, custos, cenários de crescimento e os valores iniciais do simulador do mercadinho. Mudou lá, o site inteiro se atualiza: textos, gráficos, tabelas e simuladores.

Os textos e dados de apoio (análise da ANP, SWOT, 5W2H, equipe, fontes) ficam em **`src/data/conteudo.js`**.

## Como o modelo financeiro funciona

O cálculo está em `src/lib/modelo.js`, com testes em `src/lib/modelo.test.js`.

**Investidor.** A rodada proposta é de R$ 500 mil por 20% da empresa (valor de R$ 2,5 milhões depois do aporte). Para cada cenário, o modelo projeta 5 anos:

- receita = lojas pagantes médias no ano × mensalidade média (R$ 100: 70% no plano de R$ 79 e 30% no de R$ 149) × 12;
- custos = impostos (10%), nuvem por loja, custo para conquistar cada loja nova (incluindo repor as que cancelam, 1,5% ao mês), equipe e administrativo;
- valor da empresa no ano = múltiplo × receita recorrente anual (3×, 4× e 5× nos cenários conservador, base e otimista);
- se o caixa acabar, a empresa capta o que falta e o investidor é diluído.

A participação vale o preço pago nos anos 1 e 2 (não há negociação que diga outro valor) e, a partir do ano 3, a fatia do valor da empresa. O resultado é comparado com o mesmo valor aplicado no CDI a 15% ao ano, com juros compostos. Os dois lados estão em valores brutos, antes do imposto de renda.

| Cenário | Lojas no ano 5 | R$ 100 mil viram | Rende ao ano |
|---|---|---|---|
| CDI 15% | · | R$ 201 mil | 15,0% |
| Conservador | 1.200 | R$ 173 mil | 11,6% |
| Base | 3.000 | R$ 576 mil | 41,9% |
| Otimista | 5.000 | R$ 1,2 milhão | 64,4% |

No cenário conservador o CDI ganha, e isso é mostrado de propósito: é o risco de investir cedo. Para empatar com o CDI no cenário base, a empresa precisa de cerca de 1.050 lojas pagantes no ano 5.

**Dono do mercadinho.** Ganho por mês = vendas em itens abaixo da faixa da região × [(1 − vendas perdidas) × (aumento + margem bruta) − margem bruta]. Com os valores iniciais (faturamento de R$ 80 mil, 20% das vendas abaixo da região, aumento de 3%, 1% de vendas perdidas, margem bruta de 22%), o ganho é de R$ 440 por mês. Descontada a assinatura de R$ 79, sobram R$ 361 por mês, e o lucro da loja sobe 11%.

São estimativas do grupo para fins acadêmicos, não recomendação de investimento.

## Fontes

- ANP, Série Histórica de Preços de Combustíveis e GLP (janeiro a agosto de 2026), tratada na 1ª entrega do projeto.
- Ranking ABRAS 2025: 439.728 lojas no varejo alimentar brasileiro.
- Sebrae-SP: 26.965 estabelecimentos supermercadistas no estado de São Paulo, 65% micro e pequenos.
- Agência Sebrae: 162 minimercados e mercearias abertos por dia no Brasil no 1º semestre de 2025.

## Estrutura

```
src/
  data/premissas.js     números do modelo (edite aqui)
  data/conteudo.js      textos, dados da ANP, SWOT, 5W2H, equipe e fontes
  lib/modelo.js         cálculos do investidor e do mercadinho
  lib/formato.js        formatação em reais e porcentagem
  secoes/               uma seção do site por arquivo
  components/graficos/  gráficos em SVG (sem biblioteca externa)
  assets/img/           imagens otimizadas
```

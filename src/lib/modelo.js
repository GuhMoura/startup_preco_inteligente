// Modelo financeiro do Preço Inteligente.
// Funções puras: recebem premissas, devolvem números. Não há nada de React aqui,
// o que permite testar tudo com `npm test`.
import {
  ANO_PRIMEIRA_AVALIACAO,
  CDI_ANUAL,
  CUSTOS,
  HORIZONTE_ANOS,
  MIX_PLANOS,
  PLANOS,
  RODADA,
} from '../data/premissas.js';

export function precoDoPlano(id, planos = PLANOS) {
  const plano = planos.find((p) => p.id === id);
  if (!plano) throw new Error(`Plano desconhecido: ${id}`);
  return plano.preco;
}

// Mensalidade média de uma loja pagante, ponderada pelo mix de planos.
export function ticketMedio(planos = PLANOS, mix = MIX_PLANOS) {
  return Object.entries(mix).reduce((soma, [id, fatia]) => soma + precoDoPlano(id, planos) * fatia, 0);
}

// Projeção ano a ano de um cenário: receita, custos, resultado, caixa e valor da empresa.
export function projetarCenario(cenario, { custos = CUSTOS, rodada = RODADA, ticket = ticketMedio() } = {}) {
  const anos = [];
  let lojasInicio = 0;
  let caixa = rodada.valorCaptado;
  let caixaMinimo = caixa;
  let anoAporte = null;

  cenario.lojasFimAno.forEach((lojasFim, i) => {
    const lojasMedias = (lojasInicio + lojasFim) / 2;
    const receita = lojasMedias * ticket * 12;
    const impostos = receita * custos.impostosSobreReceita;
    const infraestrutura = lojasMedias * custos.infraPorLojaMes * 12 + custos.infraFixaAno;
    // lojas que cancelam precisam ser repostas, então também custam aquisição
    const cancelamentos = lojasMedias * custos.cancelamentoMensal * 12;
    const lojasNovas = Math.max(0, lojasFim - lojasInicio) + cancelamentos;
    const aquisicao = lojasNovas * custos.custoAquisicaoPorLoja;
    const equipe = cenario.equipe[i];
    const administrativo = cenario.administrativo[i];
    const custoTotal = impostos + infraestrutura + aquisicao + equipe + administrativo;
    const resultado = receita - custoTotal;

    caixa += resultado;
    if (caixa < 0 && anoAporte === null) anoAporte = i + 1;
    caixaMinimo = Math.min(caixaMinimo, caixa);

    const receitaRecorrenteAnual = lojasFim * ticket * 12;
    anos.push({
      ano: i + 1,
      lojasInicio,
      lojasFim,
      lojasNovas,
      receita,
      impostos,
      infraestrutura,
      aquisicao,
      equipe,
      administrativo,
      custoTotal,
      resultado,
      caixa,
      receitaRecorrenteAnual,
      valorEmpresa: receitaRecorrenteAnual * cenario.multiploReceita,
    });
    lojasInicio = lojasFim;
  });

  const posMoney = rodada.valorCaptado / rodada.participacao;
  // Se o caixa acabar, a empresa capta o que falta com o mesmo valor da rodada
  // anterior, e quem já era sócio é diluído.
  const aporteExtra = Math.max(0, -caixaMinimo);
  const fatorDiluicao = posMoney / (posMoney + aporteExtra);

  return {
    cenario,
    ticket,
    anos,
    posMoney,
    preMoney: posMoney - rodada.valorCaptado,
    caixaMinimo,
    aporteExtra,
    anoAporte,
    fatorDiluicao,
    anoLucro: anos.find((a) => a.resultado > 0)?.ano ?? null,
  };
}

// Compara o mesmo valor aplicado no CDI ou investido na startup.
export function simularInvestidor({
  valor,
  projecao,
  cdi = CDI_ANUAL,
  horizonte = HORIZONTE_ANOS,
  anoPrimeiraAvaliacao = ANO_PRIMEIRA_AVALIACAO,
}) {
  const participacaoInicial = valor / projecao.posMoney;
  const participacaoNoAno = (ano) =>
    projecao.anoAporte !== null && ano >= projecao.anoAporte
      ? participacaoInicial * projecao.fatorDiluicao
      : participacaoInicial;

  const serie = [{ ano: 0, cdi: valor, startup: valor, avaliado: false }];
  for (let ano = 1; ano <= horizonte; ano++) {
    const avaliado = ano >= anoPrimeiraAvaliacao;
    const startup = avaliado ? participacaoNoAno(ano) * projecao.anos[ano - 1].valorEmpresa : valor;
    serie.push({ ano, cdi: valor * (1 + cdi) ** ano, startup, avaliado });
  }

  const final = serie[horizonte];
  const multiploStartup = final.startup / valor;
  const multiploCdi = final.cdi / valor;
  const ultimoAno = projecao.anos[horizonte - 1];

  // Quantas lojas a empresa precisa ter no fim do horizonte para empatar com o CDI.
  // Não depende do valor investido, só da participação comprada.
  const valorEmpresaEmpate = final.cdi / participacaoNoAno(horizonte);
  const lojasEmpate = valorEmpresaEmpate / (projecao.cenario.multiploReceita * projecao.ticket * 12);

  return {
    valor,
    serie,
    participacaoInicial,
    participacaoFinal: participacaoNoAno(horizonte),
    cdiFinal: final.cdi,
    startupFinal: final.startup,
    lucroCdi: final.cdi - valor,
    lucroStartup: final.startup - valor,
    multiploCdi,
    multiploStartup,
    taxaAnualStartup: multiploStartup > 0 ? multiploStartup ** (1 / horizonte) - 1 : -1,
    vezesOLucroDoCdi: (final.startup - valor) / (final.cdi - valor),
    lojasEmpate,
    lojasFinais: ultimoAno.lojasFim,
  };
}

// Quanto o dono do mercadinho ganha por mês ao corrigir os itens vendidos abaixo da região.
export function simularMercadinho({
  faturamentoMensal,
  margemBruta,
  margemLiquida,
  fatiaAbaixoDoMercado,
  ajustePreco,
  perdaVolume,
  mensalidade,
}) {
  const receitaItens = faturamentoMensal * fatiaAbaixoDoMercado;
  // lucro bruto nos itens: antes R·mb; depois R·(1−v)·(a + mb)
  const ganhoBruto = receitaItens * ((1 - perdaVolume) * (ajustePreco + margemBruta) - margemBruta);
  const lucroAtual = faturamentoMensal * margemLiquida;
  const ganhoLiquido = ganhoBruto - mensalidade;

  return {
    receitaItens,
    ganhoBruto,
    mensalidade,
    ganhoLiquido,
    ganhoLiquidoAno: ganhoLiquido * 12,
    lucroAtual,
    lucroNovo: lucroAtual + ganhoLiquido,
    aumentoLucro: lucroAtual > 0 ? ganhoLiquido / lucroAtual : 0,
    retornoPorReal: mensalidade > 0 ? ganhoBruto / mensalidade : null,
    diasParaPagar: ganhoBruto > 0 ? mensalidade / (ganhoBruto / 30) : null,
    custoPorDia: mensalidade / 30,
  };
}

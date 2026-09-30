// Formatação no padrão brasileiro.

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const brl0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const inteiro = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export const reais = (v) => brl.format(v);
export const reais0 = (v) => brl0.format(Math.round(v));
export const numero = (v) => inteiro.format(Math.round(v));

export function pct(v, casas = 1) {
  return `${(v * 100).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
}

export function multiplo(v, casas = 1) {
  return `${v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}×`;
}

// R$ 1,2 mi · R$ 480 mil · R$ 950
export function reaisCompacto(v) {
  const a = Math.abs(v);
  const sinal = v < 0 ? '−' : '';
  const fmt = (n, casas) => n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: casas });
  if (a >= 1_000_000) return `${sinal}R$ ${fmt(a / 1_000_000, a >= 10_000_000 ? 1 : 2)} mi`;
  if (a >= 1_000) return `${sinal}R$ ${fmt(a / 1_000, a >= 100_000 ? 0 : 1)} mil`;
  return `${sinal}R$ ${fmt(a, 0)}`;
}

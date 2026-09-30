import { reais } from '../lib/formato.js';

// Etiqueta amarela de gôndola, com centavos em sobrescrito.
export function Etiqueta({ valor, produto, rodape, mini = false }) {
  const [inteiro, centavos] = valor.toFixed(2).split('.');
  return (
    <div className={mini ? 'etiqueta etiqueta--mini' : 'etiqueta'}>
      {produto && <span className="etiqueta__produto">{produto}</span>}
      <span className="sr-only">{reais(valor)}</span>
      <span className="etiqueta__preco" aria-hidden="true">
        <span className="etiqueta__rs">R$</span>
        <span className="etiqueta__inteiro">{inteiro}</span>
        <span className="etiqueta__centavos">,{centavos}</span>
      </span>
      {rodape && <span className="etiqueta__rodape">{rodape}</span>}
    </div>
  );
}

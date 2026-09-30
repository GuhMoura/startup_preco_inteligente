import { useLayoutEffect, useRef, useState } from 'react';

// Mede a largura do elemento para desenhar os gráficos no tamanho real da tela.
export function useLargura(inicial = 640) {
  const ref = useRef(null);
  const [largura, setLargura] = useState(inicial);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setLargura(el.getBoundingClientRect().width || inicial);
    const obs = new ResizeObserver(([entrada]) => {
      const w = entrada.contentRect.width;
      if (w > 0) setLargura(w);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [inicial]);

  return [ref, largura];
}

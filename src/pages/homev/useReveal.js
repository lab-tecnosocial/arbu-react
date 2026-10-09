import { useEffect } from "react";

/**
 * Anima la entrada de los elementos marcados con `data-reveal` dentro del
 * contenedor: cuando entran en pantalla reciben `data-visible` y la animación
 * de HomePage.module.css los hace aparecer. Cada elemento se anima una sola vez.
 *
 * El retraso escalonado va en la variable CSS `--reveal-delay`, puesta en el
 * `style` de cada elemento.
 */
export const useReveal = (ref) => {
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;

    const elementos = raiz.querySelectorAll("[data-reveal]");
    const mostrar = (el) => el.setAttribute("data-visible", "");

    const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sinAnimacion || !("IntersectionObserver" in window)) {
      elementos.forEach(mostrar);
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          mostrar(entrada.target);
          observer.unobserve(entrada.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
};

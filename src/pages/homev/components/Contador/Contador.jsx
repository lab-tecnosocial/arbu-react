import { useEffect, useRef, useState } from "react";

const DURACION_MS = 1400;

/** 1600 → "1.600", como se escriben las cifras en el resto del sitio. */
const formatear = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Cifra que cuenta desde 0 hasta `valor` la primera vez que entra en pantalla.
 * Con movimiento reducido muestra el valor final directamente.
 */
export const Contador = ({ valor }) => {
  const ref = useRef(null);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || sinAnimacion || !("IntersectionObserver" in window)) {
      setActual(valor);
      return;
    }

    let frame;
    const animar = () => {
      const inicio = performance.now();
      const paso = (ahora) => {
        const t = Math.min((ahora - inicio) / DURACION_MS, 1);
        const suavizado = 1 - Math.pow(1 - t, 3); // ease-out cúbico
        setActual(Math.round(valor * suavizado));
        if (t < 1) frame = requestAnimationFrame(paso);
      };
      frame = requestAnimationFrame(paso);
    };

    const observer = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return;
      animar();
      observer.disconnect();
    }, { threshold: 0.6 });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [valor]);

  return <span ref={ref}>{formatear(actual)}</span>;
};

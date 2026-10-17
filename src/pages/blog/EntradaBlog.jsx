import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { buscarEntrada, formatearFecha } from "../../blog/blog";
import Footer from "../../components/footer/Footer";
import styles from "./Blog.module.css";

/** Una entrada completa del blog, en /blog/:slug. */
export const EntradaBlog = () => {
  const { slug } = useParams();
  const entrada = buscarEntrada(slug);

  // Al abrir una entrada desde el listado, empezar a leer desde arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!entrada) return <Navigate to="/blog" replace />;

  return (
    <div className={styles.pagina}>
      <section>
        <article className={styles.entrada}>
          <Link to="/blog" className={styles.volver}>
            <ArrowLeft size={18} strokeWidth={1.75} /> Volver al blog
          </Link>

          <header className={styles.entradaEncabezado}>
            {entrada.borrador && <span className={styles.borradorEnLinea}>Borrador: no se ve en el sitio publicado</span>}
            <h1>{entrada.titulo}</h1>
            <div className={styles.meta}>
              <span><CalendarDays size={16} strokeWidth={1.75} /> {formatearFecha(entrada.fecha)}</span>
              {entrada.autor && <span><User size={16} strokeWidth={1.75} /> {entrada.autor}</span>}
            </div>
          </header>

          {entrada.imagen && (
            <div className={styles.portada}>
              <img src={entrada.imagen} alt="" />
            </div>
          )}

          {/* El HTML sale de los archivos del propio repositorio, no de usuarios. */}
          <div className={styles.texto} dangerouslySetInnerHTML={{ __html: entrada.html }} />
        </article>
      </section>
      <Footer />
    </div>
  );
};

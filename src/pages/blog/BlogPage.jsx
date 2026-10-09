import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { entradas, formatearFecha } from "../../blog/blog";
import Footer from "../../components/footer/Footer";
import styles from "./Blog.module.css";

/** Listado del blog: una tarjeta por entrada de `src/blog/entradas/`. */
export const BlogPage = () => {
  return (
    <div className={styles.pagina}>
      <section>
        <div className={styles.contenedor}>
          <header className={styles.encabezado}>
            <h1>Blog de <span className="text-green">Arbu</span></h1>
            <p>Crónicas de las jornadas, novedades de la app y todo lo que aprendemos cuidando el arbolado urbano.</p>
          </header>

          {entradas.length === 0 ? (
            <p className={styles.vacio}>Muy pronto publicaremos la primera entrada.</p>
          ) : (
            <div className={styles.tarjetas}>
              {entradas.map((entrada, i) => (
                <Link
                  key={entrada.slug}
                  to={`/blog/${entrada.slug}`}
                  className={styles.tarjeta}
                  style={{ "--retraso": `${(i % 3) * 90}ms` }}
                >
                  <div className={styles.imagen}>
                    {entrada.imagen && <img src={entrada.imagen} alt="" loading="lazy" />}
                    {entrada.borrador && <span className={styles.borrador}>Borrador</span>}
                  </div>
                  <div className={styles.cuerpo}>
                    <span className={styles.fecha}>
                      <CalendarDays size={16} strokeWidth={1.75} />
                      {formatearFecha(entrada.fecha)}
                    </span>
                    <h2>{entrada.titulo}</h2>
                    <p>{entrada.descripcion}</p>
                    <span className={styles.leer}>
                      Leer más <ArrowRight size={16} strokeWidth={1.75} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

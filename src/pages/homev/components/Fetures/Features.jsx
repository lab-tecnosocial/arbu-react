import { Contador } from '../Contador/Contador';
import styles from './Features.module.css';

// Las cifras van aparte para que el contador las anime al entrar en pantalla.
const logros = [
  { icono: "ficon1.png", titulo: "Actividades de forestación", texto: (c) => <>Más de {c(1600)} árboles plantados en el centro urbano.</> },
  { icono: "ficon2.png", titulo: "Premios y distinciones", texto: () => <>Reconocidos a nivel nacional por nuestras actividades ambientales.</> },
  { icono: "ficon3.png", titulo: "Participación comunitaria", texto: (c) => <>Más de {c(500)} voluntarios activos en jornadas ambientales.</> },
  { icono: "ficon4.png", titulo: "Monitoreo de árboles", texto: (c) => <>Más de {c(2600)} árboles registrados y geolocalizados en ARBU.</> },
  { icono: "ficon5.png", titulo: "Adopciones de árboles", texto: (c) => <>{c(850)} árboles urbanos adoptados por vecinos y vecinas.</> },
  { icono: "ficon6.png", titulo: "Colaboraciones", texto: (c) => <>Alianzas con {c(10)} organizaciones para proyectos de reforestación.</> },
];

const cifra = (valor) => (
  <strong className={styles.cifra}>
    <Contador valor={valor} />
  </strong>
);

export const Features = () => {
  return (
    <section>
      <div className={styles.features}>
        <div className={styles.featuresHeader} data-reveal="">
          <h2>El impacto de <span className="text-green">ARBU</span> a través del tiempo</h2>
          <p>Cada logro cuenta una historia de esfuerzo y colaboración. Descubre cómo ARBU ha contribuido a un entorno más verde y consciente desde sus inicios.</p>
        </div>
        <div className={styles.featuresCards}>
          {logros.map((logro, i) => (
            <div
              key={logro.titulo}
              className={styles.card}
              data-reveal=""
              // Escalonado por columna (3 por fila), no por posición absoluta:
              // la segunda fila no debe esperar a que termine la primera.
              style={{ "--reveal-delay": `${(i % 3) * 110}ms` }}
            >
              <div className={styles.icon}>
                <img src={logro.icono} alt="" />
              </div>
              <div className={styles.content}>
                <h3>{logro.titulo}</h3>
                <p>{logro.texto(cifra)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

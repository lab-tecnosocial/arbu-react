import { BookMarked, ClipboardList, FileSpreadsheet, FolderKanban, Map, Medal, Smartphone, Table2 } from "lucide-react";
import { Button } from "../../../../components/button/Button";
import styles from "./Editions.module.css";

const iconProps = { size: 20, strokeWidth: 1.75 };

const arbu = [
  { icon: <Map {...iconProps} />, label: "Mapa de los árboles de la ciudad, para adoptarlos y seguir su cuidado" },
  { icon: <Medal {...iconProps} />, label: "Ranking de quienes más plantan y monitorean" },
  { icon: <BookMarked {...iconProps} />, label: "Aprende: catálogo de especies y guías de selección y plantación" },
  { icon: <Smartphone {...iconProps} />, label: "App para Android, con el mapeo desde el celular" },
];

const arbuPro = [
  { icon: <Table2 {...iconProps} />, label: "Tabla editable de todos los árboles mapeados" },
  { icon: <FileSpreadsheet {...iconProps} />, label: "Mapeo scout por grupo, con validación y exportación a Excel" },
  { icon: <FolderKanban {...iconProps} />, label: "Gestión de proyectos: mapeadores, fechas y reportes propios" },
  { icon: <ClipboardList {...iconProps} />, label: "Solicitudes de inscripción a las jornadas de mapeo" },
];

export const Editions = () => {
  return (
    <section className={styles.editionsSection}>
      <div className={styles.editions}>
        <div className={styles.editionsHeader}>
          <h2>Arbu y <span className="text-green">Arbu Pro</span></h2>
          <p>La misma plataforma con dos caras: una abierta a toda la ciudadanía y otra para los equipos que organizan y administran el mapeo del arbolado.</p>
        </div>

        <div className={styles.editionsCards}>
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <span className={styles.badge}>Abierto a todos</span>
              <h3>Arbu</h3>
              <p>Para cualquier persona que quiera conocer, adoptar y cuidar los árboles de su ciudad. No necesitas cuenta para explorar.</p>
            </header>
            <ul className={styles.list}>
              {arbu.map((item) => (
                <li key={item.label}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
            <Button variant="terciary" href="/mapa" className={styles.cardButton}>
              Ver el mapa
            </Button>
          </article>

          <article className={`${styles.card} ${styles.cardPro}`}>
            <header className={styles.cardHeader}>
              <span className={`${styles.badge} ${styles.badgePro}`}>Requiere cuenta autorizada</span>
              <h3>Arbu Pro</h3>
              <p>Para instituciones, grupos scouts y equipos de mapeo: el back-office donde se revisan, validan y reportan los datos que llegan del campo.</p>
            </header>
            <ul className={styles.list}>
              {arbuPro.map((item) => (
                <li key={item.label}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
            <Button variant="secondary" href="/admin" className={styles.cardButton}>
              Entrar a Arbu Pro
            </Button>
          </article>
        </div>
      </div>
    </section>
  )
}

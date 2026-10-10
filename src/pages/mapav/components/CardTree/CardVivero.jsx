import styles from "./CardTree.module.css";
import viveroStyles from "./CardVivero.module.css";
import { animate } from "animejs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Leaf, Phone, X } from "lucide-react";
import { setPanelState } from "../../../../actions/mapaActions";
import { esVivero } from "../../../../helpers/viveros";

export const CardVivero = () => {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const { panelState, selectedTree } = useSelector((state) => state.mapa);
  const [isLargeScreen, setIsLargeScreen] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = (e) => {
      setIsLargeScreen(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const esFichaVivero = esVivero(selectedTree);

  useEffect(() => {
    if (!contentRef.current || !esFichaVivero) return;

    if (panelState === "OPEN") {
      animate(contentRef.current, {
        minWidth: isLargeScreen ? "500px" : "100%",
        width: isLargeScreen ? "500px" : "100%",
        opacity: 1,
        duration: 300,
        ease: "outQuad",
        display: "block",
      });
    } else if (panelState === "CLOSE") {
      animate(contentRef.current, {
        minWidth: "0px",
        width: "0px",
        opacity: isLargeScreen ? 1 : 0,
        duration: 300,
        ease: "linear",
        onComplete: () => {
          animate(contentRef.current, {
            display: "none",
            duration: 300,
          });
        },
      });
    }
  }, [panelState, selectedTree, isLargeScreen, esFichaVivero]);

  if (!esFichaVivero) return null;

  const especies = selectedTree.especies ?? [];

  return (
    <div
      ref={contentRef}
      className={isLargeScreen ? styles.cardTree : styles.cardTreeMobile}
    >
      <div className={styles.cardInner}>
        <div className={styles.topBar}>
          <span>Detalles de vivero</span>
          <div className={styles.topBarOptions}>
            <button
              className={styles.closeButton}
              onClick={() => dispatch(setPanelState("CLOSE"))}
            >
              <X strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.treeInfo}>
            <div className={styles.headerTitle}>
              <h2>{selectedTree.nombre}</h2>
            </div>
            <div className={styles.info}>
              <div className={styles.picture}>
                {selectedTree.foto ? (
                  <img
                    src={selectedTree.foto}
                    alt={`Foto de ${selectedTree.nombre}`}
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className={styles.details}>
                <div className={styles.detail}>
                  <span className={styles.labelFirst}>Nombre del vivero</span>
                  <span className={styles.labelSecond}>{selectedTree.nombre}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.labelFirst}>Contacto</span>
                  <span className={styles.labelSecond}>{selectedTree.contacto}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className={styles.treeFeatures}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Phone size={20} /></div>
              <div className={styles.detail}>
                <span className={styles.labelFirst}>Contacto</span>
                <span className={styles.labelSecond}>{selectedTree.contacto}</span>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Leaf size={20} /></div>
              <div className={styles.detail}>
                <span className={styles.labelFirst}>Especies</span>
                <span className={styles.labelSecond}>{especies.length}</span>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className={styles.treeMonitoring}>
            <h3>Lista de especies</h3>
            <ul className={viveroStyles.especies}>
              {especies.map((especie) => (
                <li key={especie} className={viveroStyles.especie}>
                  {especie}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

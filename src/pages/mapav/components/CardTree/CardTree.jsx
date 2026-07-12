import styles from "./CardTree.module.css"
import galleryStyles from "./TreePhotoGallery.module.css"
import { animate } from "animejs";
import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, ChevronLeft, ChevronRight, Droplets, Heart, MapPinCheckInside, MapPinned, MoveVertical, ShieldPlus, ShieldUser, User, X } from "lucide-react";
import { Chip } from "../../../../components/Chip/Chip";
import { setPanelState, setSelectedTree } from "../../../../actions/mapaActions";
import { TreePhotoGallery, TreePhotoTrigger } from "./TreePhotoGallery";
import {
  formatMonitoreoDateLong,
  getTreePhotos,
  MAPPED_PARTS_UI,
} from "./treePhotos";

export const CardTree = () => {
  const dispatch = useDispatch()
  const contentRef = useRef(null)
  const { usuarios, panelState, selectedTree, index } = useSelector((state) => state.mapa)
  const { arbolesPlantados } = useSelector((state) => state.arboles)
  const [monitoreos, setMonitoreos] = useState([])
  const [riegos, setRiegos] = useState([])
  const [isLargeScreen, setIsLargeScreen] = useState(
    window.matchMedia('(min-width: 768px)').matches
  );

  const getFullNameUser = (id) => {
    if (selectedTree && usuarios) {
      for (const [_, value] of Object.entries(usuarios)) {
        if (value.id === id) {
          return value.nombre;
        }
      }
    }
    return "";
  };

  const toDate = (timestamp, locale = "es-BO") => {
    if (!timestamp || typeof timestamp.seconds !== "number") {
      throw new Error("El timestamp no es válido");
    }

    const date = timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1e6

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  }

  useEffect(() => {
    if (selectedTree) {
      if (typeof selectedTree.monitoreos === "object") {
        setMonitoreos(Object.values(selectedTree.monitoreos));
      } else {
        setMonitoreos([]);
      }
      if (typeof selectedTree.riegos === "object") {
        setRiegos(Object.values(selectedTree.riegos));
      } else {
        setRiegos([]);
      }
    }
  }, [selectedTree])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleMediaQueryChange = (e) => {
      setIsLargeScreen(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    if (panelState === "OPEN") {
      animate(contentRef.current, {
        minWidth: isLargeScreen ? "500px" : "100%",
        width: isLargeScreen ? "500px" : "100%",
        opacity: 1,
        duration: 300,
        ease: 'outQuad',
        display: "block",
      })
    } else if (panelState === "CLOSE") {
      animate(contentRef.current, {
        minWidth: "0px",
        width: "0px",
        opacity: isLargeScreen ? 1 : 0,
        duration: 300,
        ease: 'linear',
        onComplete: () => {
          animate(contentRef.current, {
            display: "none",
            duration: 300,
          })
        }
      })
    }
  }, [panelState, selectedTree, isLargeScreen])

  const isMapped = selectedTree && Object.hasOwn(selectedTree, "mapeadoPor");
  const photos = useMemo(
    () => getTreePhotos(isMapped, monitoreos),
    [isMapped, monitoreos]
  );

  const mainPhoto = useMemo(() => {
    if (!photos.length) return null;
    if (isMapped) {
      return (
        photos.find((p) => p.key === "fotoArbolCompleto") ?? photos[0]
      );
    }
    return photos[0];
  }, [photos, isMapped]);

  const galleryKey =
    selectedTree?.id ??
    `${selectedTree?.latitud ?? ""}-${selectedTree?.longitud ?? ""}-${index}`;

  return (
    <div
      ref={contentRef}
      className={isLargeScreen ? styles.cardTree : styles.cardTreeMobile}
    >
      <div className={styles.cardInner}>
        <div className={styles.topBar}>
          <span>Detalles de Árbol</span>
          <div className={styles.topBarOptions}>
            {/* <span className={styles.topBarIndicator}>
              {index + 1} de {arbolesPlantados.filteredData.length > 0 ? arbolesPlantados.filteredData.length : arbolesPlantados.data.length}
            </span>
            <div className={styles.buttons}>
              <button
                onClick={() => {
                  if (index > 0) {
                    const newIndex = index - 1;
                    const newTree = arbolesPlantados.filteredData.length > 0 ? arbolesPlantados.filteredData[newIndex] : arbolesPlantados.data[newIndex];
                    dispatch(setSelectedTree(newIndex, newTree));
                  }
                }}
              ><ChevronLeft size={20} strokeWidth={1.75} /></button>
              <button
                onClick={() => {
                  const maxIndex = arbolesPlantados.filteredData.length > 0 ? arbolesPlantados.filteredData.length : arbolesPlantados.data.length;
                  if (index < maxIndex - 1) {
                    const newIndex = index + 1;
                    const newTree = arbolesPlantados.filteredData.length > 0 ? arbolesPlantados.filteredData[newIndex] : arbolesPlantados.data[newIndex];
                    dispatch(setSelectedTree(newIndex, newTree));
                  }
                }}
              ><ChevronRight size={20} strokeWidth={1.75} /></button>
            </div> */}
            <button
              className={styles.closeButton}
              onClick={() => {
                dispatch(setPanelState("CLOSE"))
              }}
            >
              <X strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <div className={styles.cardBody}>
          <TreePhotoGallery photos={photos} galleryKey={galleryKey}>
          <div className={styles.treeInfo}>
            <div className={styles.headerTitle}>
              <h2>
                {selectedTree.nombreComun}
              </h2>
              <div className={styles.headerDetails}>
                {
                  monitoreos.length > 0 ?
                    <Chip label="Monitoreado" variant="success" />
                    :
                    <Chip label="Monitoreado" variant="warning" />
                }
                {
                  !Object.hasOwn(selectedTree, "mapeadoPor") ?
                    (riegos.length > 0 ?
                      <Chip label="Regado" variant="success" />
                      :
                      <Chip label="Sin regar" variant="warning" />
                    ) : (null)
                }
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.picture}>
                {mainPhoto && (
                  <TreePhotoTrigger src={mainPhoto.src} photoKey={mainPhoto.key}>
                    <button type="button" className={galleryStyles.clickablePhoto} aria-label={`Ver foto: ${mainPhoto.label}`}>
                      <img src={mainPhoto.src} alt={mainPhoto.label} loading="lazy" />
                    </button>
                  </TreePhotoTrigger>
                )}
              </div>
              <div className={styles.details}>
                <div className={styles.detail}>
                  <span className={styles.labelFirst}>Nombre propio</span>
                  <span className={styles.labelSecond}>{selectedTree.nombrePropio}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.labelFirst}>Nombre común</span>
                  <span className={styles.labelSecond}>{selectedTree?.nombreComun}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.labelFirst}>Nombre científico</span>
                  <span className={styles.labelSecond}>{selectedTree.nombreCientifico}</span>
                </div>                
              </div>
            </div>
            {isMapped && monitoreos.length > 0 && (
              <div className={styles.estadoMapeo}>
                {MAPPED_PARTS_UI.map(({ key, label }) => {
                  const src = monitoreos[0][key];
                  const photoLabel = photos.find((p) => p.key === key)?.label ?? label;

                  if (!src) {
                    return (
                      <div key={key} className={galleryStyles.estadoImgDisabled}>
                        {label}
                      </div>
                    );
                  }

                  return (
                    <TreePhotoTrigger key={key} src={src} photoKey={key}>
                      <button
                        type="button"
                        className={galleryStyles.estadoImgButton}
                        aria-label={`Ver foto: ${photoLabel}`}
                      >
                        {label}
                      </button>
                    </TreePhotoTrigger>
                  );
                })}
              </div>
            )}
          </div>
          <div className="line"></div>
          <div className={styles.treeFeatures}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><Heart size={20} /></div>
              <div className={styles.detail}>
                <span className={styles.labelFirst}>Estado</span>
                <span className={styles.labelSecond}>{Object.hasOwn(selectedTree, "estado") ? selectedTree.estado : "mapeado"}</span>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}><MoveVertical size={20} /></div>
              <div className={styles.detail}>
                <span className={styles.labelFirst}>Altura {"(cm)"}</span>
                <span className={styles.labelSecond}>{monitoreos.length > 0 && monitoreos[0].altura}</span>
              </div>
            </div>
            {
              Object.hasOwn(selectedTree, "riegos") &&
              <div className={styles.feature}>
                <div className={styles.featureIcon}><Droplets size={20} /></div>
                <div className={styles.detail}>
                  <span className={styles.labelFirst}>Riegos</span>
                  <span className={styles.labelSecond}>{riegos.length}</span>
                </div>
              </div>
            }
            <div className={styles.feature}>
              <div className={styles.featureIcon}><MapPinCheckInside size={20} /></div>
              <div className={styles.detail}>
                <span className={styles.labelFirst}>Monitoreos</span>
                <span className={styles.labelSecond}>{monitoreos.length}</span>
              </div>
            </div>
            {
              Object.hasOwn(selectedTree, 'usuariosQueAdoptaron') &&
              <div className={styles.feature}>
                <div className={styles.featureIcon}><ShieldUser size={20} /></div>
                <div className={styles.detail}>
                  <span className={styles.labelFirst}>Adoptado por</span>
                  <span className={styles.labelSecond}>{getFullNameUser(selectedTree.usuariosQueAdoptaron[0])}</span>
                </div>
              </div>
            }
            <div className={styles.feature}>
              <div className={styles.featureIcon}><MapPinned size={20} /></div>
              <div className={styles.detail}>
                <span className={styles.labelFirst}>Lugar de plantación</span>
                <span className={styles.labelSecond}>{selectedTree.lugarDePlantacion}</span>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className={styles.treeMonitoring}>
            <h3>Monitoreos</h3>
            {monitoreos.length > 0 &&
              monitoreos.map((item) => {
                const date = toDate(item.timestamp)
                const itemSrc = isMapped
                  ? item.fotoArbolCompleto
                  : item.fotografia;
                const itemLabel = isMapped
                  ? "Árbol completo"
                  : `Monitoreado el ${formatMonitoreoDateLong(item.timestamp)}`;

                return (
                  <div key={item.timestamp?.seconds ?? item.monitoreoRealizadoPor} className={styles.monitoring}>
                    <div className={styles.monitoringPicture}>
                      {itemSrc ? (
                        <TreePhotoTrigger src={itemSrc}>
                          <button type="button" className={galleryStyles.clickablePhoto} aria-label={`Ver foto: ${itemLabel}`}>
                            <img src={itemSrc} alt={itemLabel} loading="lazy" />
                          </button>
                        </TreePhotoTrigger>
                      ) : null}
                    </div>
                    <div className={styles.monitoringInfo}>
                      <div className={styles.detail}>
                        <div className={styles.labelFirst}>
                          <Calendar size={16} />
                          <span>Fecha</span>
                        </div>
                        <span className={styles.labelSecond}>{date}</span>
                      </div><div className={styles.detail}>
                        <div className={styles.labelFirst}>
                          <User size={16} />
                          <span>Monitereado por</span>
                        </div>
                        <span className={styles.labelSecond}>{getFullNameUser(item.monitoreoRealizadoPor)}</span>
                      </div>
                      <div className={styles.detail}>
                        <div className={styles.labelFirst}>
                          <MoveVertical size={16} />
                          <span>Altura</span>
                        </div>
                        <span className={styles.labelSecond}>{item.altura}</span>
                      </div>
                      {
                        Object.hasOwn(selectedTree, "mapeadoPor") ?
                          <div className={styles.detail}>
                            <div className={styles.labelFirst}>
                              <MoveVertical size={16} />
                              <span>Diametro</span>
                            </div>
                            <span className={styles.labelSecond}>{item.diametroAlturaPecho}</span>
                          </div>
                          :
                          <div className={styles.detail}>
                            <div className={styles.labelFirst}>
                              <ShieldPlus size={16} />
                              <span>Sanidad</span>
                            </div>
                            <span className={styles.labelSecond}>{item.sanidad}</span>
                          </div>
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
          </TreePhotoGallery>
        </div>
      </div>
    </div>
  )
}


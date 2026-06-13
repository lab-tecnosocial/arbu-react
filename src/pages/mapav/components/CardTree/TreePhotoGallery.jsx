import "react-photo-view/dist/react-photo-view.css";
import { createContext,useCallback,useContext,useEffect,useMemo,useState,cloneElement,isValidElement,} from "react";
import { PhotoSlider } from "react-photo-view";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import styles from "./TreePhotoGallery.module.css";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;

const TreePhotoContext = createContext(null);

function PhotoToolbar({ index, images, onIndexChange, scale, onScale }) {
  const lastIndex = images.length - 1;

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Imagen anterior"
        disabled={index <= 0}
        onClick={() => onIndexChange(index - 1)}
      >
        <ChevronLeft size={22} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Imagen siguiente"
        disabled={index >= lastIndex}
        onClick={() => onIndexChange(index + 1)}
      >
        <ChevronRight size={22} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Alejar"
        disabled={scale <= MIN_SCALE}
        onClick={() => onScale(Math.max(MIN_SCALE, scale - SCALE_STEP))}
      >
        <Minus size={20} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        aria-label="Acercar"
        disabled={scale >= MAX_SCALE}
        onClick={() => onScale(Math.min(MAX_SCALE, scale + SCALE_STEP))}
      >
        <Plus size={20} strokeWidth={1.75} />
      </button>
    </div>
  );
}

export function TreePhotoGallery({ photos, galleryKey, children }) {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setVisible(false);
    setActiveIndex(0);
  }, [galleryKey]);

  const openPhoto = useCallback(
    (photoIndex) => {
      if (photoIndex >= 0 && photoIndex < photos.length) {
        setActiveIndex(photoIndex);
        setVisible(true);
      }
    },
    [photos.length]
  );

  const sliderImages = useMemo(
    () =>
      photos.map((photo, i) => ({
        key: `${galleryKey}-${photo.key ?? i}`,
        src: photo.src,
        overlay: photo.label,
      })),
    [photos, galleryKey]
  );

  const contextValue = useMemo(
    () => ({ openPhoto, photos }),
    [openPhoto, photos]
  );

  const enableLoop = photos.length >= 3;

  return (
    <TreePhotoContext.Provider value={contextValue}>
      {children}
      {photos.length > 0 && (
        <PhotoSlider
          key={galleryKey}
          images={sliderImages}
          visible={visible}
          index={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setVisible(false)}
          loop={enableLoop}
          maskOpacity={0.92}
          bannerVisible={true}
          toolbarRender={(props) => <PhotoToolbar {...props} />}
          overlayRender={({ overlay }) =>
            overlay ? <div className={styles.caption}>{overlay}</div> : null
          }
        />
      )}
    </TreePhotoContext.Provider>
  );
}

function resolvePhotoIndex(photos, { photoKey, src }) {
  if (photoKey != null) {
    const byKey = photos.findIndex((p) => p.key === photoKey);
    if (byKey >= 0) return byKey;
  }
  if (src) {
    return photos.findIndex((p) => p.src === src);
  }
  return -1;
}

export function TreePhotoTrigger({ src, photoKey, children }) {
  const context = useContext(TreePhotoContext);

  if (!context || !src || !children) {
    return children ?? null;
  }

  const { openPhoto, photos } = context;
  const photoIndex = resolvePhotoIndex(photos, { photoKey, src });

  const handleOpen = () => {
    openPhoto(photoIndex);
  };

  if (!isValidElement(children)) {
    return children;
  }

  return cloneElement(children, {
    onClick: (event) => {
      children.props.onClick?.(event);
      if (!event.defaultPrevented) {
        handleOpen();
      }
    },
  });
}

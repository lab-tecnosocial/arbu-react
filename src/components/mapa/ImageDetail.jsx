import React,{useState, useCallback} from 'react'
import ImageViewer from "react-simple-image-viewer";
const ImageDetail = ({src}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
    
  }, []);
  // console.log(src);
  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };
  return (
    <>
    <img className='image-monitoring'
              src={src}
              onClick={() => openImageViewer(0)}
             
              key={src}
              
              alt=""
            />
             {isViewerOpen && (
        <ImageViewer
          src={[src]}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
          closeOnClickOutside={true}
        />
      )}
    </>
  )
}

export default ImageDetail
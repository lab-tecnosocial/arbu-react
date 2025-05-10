import React,{useState, useCallback} from 'react'
import ImageViewer from "react-simple-image-viewer";
import './ImageDetail.css';
const ImageDetail = ({src, imageStyles, srcToOpen}) => {
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
    <img className="image-monitoring" style={imageStyles}
              src={src}
              onClick={() => openImageViewer(0)}
             
              key={srcToOpen}
              
              alt=""
            />
             {isViewerOpen && (
        <ImageViewer
          src={[srcToOpen]}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          disableScroll={false}
          closeComponent={<span style={{color:'#fff'}}>x</span>}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.85)"
          }}
          closeOnClickOutside={true}
        />
      )}
    </>
  )
}

export default ImageDetail
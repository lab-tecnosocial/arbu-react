import React, { useState, useEffect, useCallback, useRef } from "react";

const isMobile = window.innerWidth <= 768;

const ImageCarouselModal = ({ images, isOpen, onClose }) => {
    const [current, setCurrent] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const draggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const lastOffsetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) {
            setCurrent(0);
            setZoom(1);
            setOffset({ x: 0, y: 0 });
            lastOffsetRef.current = { x: 0, y: 0 };
        }
    }, [isOpen]);

    const handleKeyDown = useCallback(
        (e) => {
            if (!isOpen) return;

            if (e.key === "ArrowLeft" && current > 0) {
                setCurrent((prev) => prev - 1);
            } else if (e.key === "ArrowRight" && current < images.length - 1) {
                setCurrent((prev) => prev + 1);
            } else if (e.key === "Escape") {
                onClose();
            }
        },
        [current, images.length, isOpen, onClose]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY || e.detail || e.wheelDelta;
        setZoom((prev) => {
            let newZoom = prev - delta * 0.001;
            if (newZoom < 1) newZoom = 1;
            if (newZoom > 5) newZoom = 5;
            return newZoom;
        });
    };

    const handleMouseDown = (e) => {
        if (zoom <= 1) return;
        draggingRef.current = true;
        startPosRef.current = {
            x: e.clientX - lastOffsetRef.current.x,
            y: e.clientY - lastOffsetRef.current.y,
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!draggingRef.current) return;
        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;

        const newOffset = { x: dx, y: dy };
        setOffset(newOffset);
        lastOffsetRef.current = newOffset;
    };

    const handleMouseUp = () => {
        if (!draggingRef.current) return;
        draggingRef.current = false;


        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleDoubleClick = () => {
        if (zoom > 1) {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
            lastOffsetRef.current = { x: 0, y: 0 };
        } else {
            setZoom(2);
        }
    };

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[current];

    return (
        <div style={styles.overlay}>
            <button onClick={onClose} style={styles.closeButton} aria-label="Cerrar">
                ✕
            </button>

            {current > 0 && (
                <button
                    onClick={() => setCurrent(current - 1)}
                    style={{ ...styles.outsideButton, left: "20px" }}
                    aria-label="Anterior"
                >
                    ⬅
                </button>
            )}

            <div style={styles.content}>
                <h2 style={styles.imageLabel}>{currentImage.tipo}</h2>
                <img
                    src={currentImage.url}
                    alt={currentImage.tipo}
                    style={{
                        ...styles.image,
                        transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom
                            }px)`,
                        cursor: zoom > 1 ? (draggingRef.current ? "grabbing" : "grab") : "auto",
                        transition: draggingRef.current ? "none" : "transform 0.3s ease",
                        userSelect: "none",
                    }}
                    onMouseDown={handleMouseDown}
                    onDoubleClick={handleDoubleClick}
                    draggable={false}
                />
            </div>

            {current < images.length - 1 && (
                <button
                    onClick={() => setCurrent(current + 1)}
                    style={{ ...styles.outsideButton, right: "20px" }}
                    aria-label="Siguiente"
                >
                    ➡
                </button>
            )}
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: isMobile ? "0 15px" : "0 60px",
        boxSizing: "border-box",
    },
    content: {
        textAlign: "center",
        color: "#fff",
        maxWidth: isMobile ? "95vw" : "80vw",
    },
    closeButton: {
        position: "absolute",
        top: isMobile ? "10px" : "20px",
        right: isMobile ? "15px" : "30px",
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: isMobile ? "20px" : "24px",
        cursor: "pointer",
    },
    imageLabel: {
        fontSize: isMobile ? "14px" : "20px",
        marginBottom: "10px",
        color: "white"
    },
    image: {
        maxWidth: isMobile ? "95vw" : "80vw",
        maxHeight: isMobile ? "70vh" : "80vh",
        borderRadius: "8px",
    },
    outsideButton: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "transparent",
        border: "none",
        color: "#fff",
        fontSize: isMobile ? "30px" : "40px",
        cursor: "pointer",
        zIndex: 10000,
    },
};

export default ImageCarouselModal;
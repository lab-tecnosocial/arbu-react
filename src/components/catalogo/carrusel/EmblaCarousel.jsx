import React, { useState, useEffect, useCallback } from "react";
import EmblaCarouselReact from "embla-carousel-react";
import useInterval from "./useInterval";
import { DotButton, PrevButton, NextButton } from "./EmblaCarouselButtons";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import { setHideDetailEspecie } from "../../../actions/catalogoActions";
import { IconButton } from "@mui/material";


import "./embla.css";

const EmblaCarouselComponent = ({ autoplay, delayLength, children }) => {
  const [embla, setEmbla] = useState(null);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [delay, setDelay] = useState(delayLength);
  const [isRunning, setIsRunning] = useState(autoplay);

  const scrollTo = useCallback(index => embla && embla.scrollTo(index), [embla]);
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  useInterval(
    () => {
      if (!embla) return;
      if (selectedIndex === scrollSnaps.length - 1) {
        scrollTo(0);
      } else {
        scrollNext();
      }
    },
    isRunning ? delay : null
  );

  useEffect(() => {
    const onSelect = () => {
      setSelectedIndex(embla.selectedScrollSnap());
      setPrevBtnEnabled(embla.canScrollPrev());
      setNextBtnEnabled(embla.canScrollNext());
    };
    if (embla) {
      setScrollSnaps(embla.scrollSnapList());
      embla.on("select", onSelect);
      onSelect();
    }
  }, [embla]);

  // Manual wrap helpers: when not using embla loop, move to first/last when boundary reached
  const goPrev = useCallback(() => {
    if (!embla) return;
    const snaps = scrollSnaps;
    if (embla.canScrollPrev()) embla.scrollPrev();
    else if (snaps.length) embla.scrollTo(snaps.length - 1);
  }, [embla, scrollSnaps]);

  const goNext = useCallback(() => {
    if (!embla) return;
    const snaps = scrollSnaps;
    if (embla.canScrollNext()) embla.scrollNext();
    else if (snaps.length) embla.scrollTo(0);
  }, [embla, scrollSnaps]);

  function handleIsRunningChange(e) {
    setIsRunning(e.target.checked);
  }

  function handleDelayChange(e) {
    setDelay(Number(e.target.value));
  }
  const dispatch = useDispatch();
  const handleBack = () => {
    dispatch(setHideDetailEspecie());
  };
  const { activeEspecie } = useSelector((state) => state.catalogo);


  return (
    <div>
        <div className="button-exit">
          <IconButton aria-label="back" onClick={handleBack}>
          <CloseIcon  sx={{color:'#EBF5EE', background:"#268576", borderRadius:"50%", border:"1px solid #EBF5EE"}}/>
          </IconButton>
        </div>
      <div className="embla" >
        <EmblaCarouselReact
          className="embla__viewport"
          emblaRef={setEmbla}
          options={{ loop: false }}
          htmlTagName="div"
        >
          <div className="embla__container" >
            {children.map((Child, index) => (
              <div className="embla__slide"  key={index}>
                <div className="embla__slide__inner">{Child}</div>
              </div>
            ))}
          </div>
        </EmblaCarouselReact>
        <div className="embla__dots">
          {scrollSnaps.map((snap, index) => (
            <DotButton
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
              key={index}
            />
          ))}
        </div>
        <PrevButton onClick={goPrev} enabled={true} />
        <NextButton onClick={goNext} enabled={true} />
      </div>
  
    </div>
  );
};

export default EmblaCarouselComponent;

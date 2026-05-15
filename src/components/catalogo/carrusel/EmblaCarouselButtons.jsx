import React from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const DotButton = ({ selected, onClick }) => (
  <button
    className={`embla__dot${selected ? " is-selected" : ""}`}
    onClick={onClick}
  />
);

export const PrevButton = ({ enabled, onClick }) => (
  <button
    className={`embla__button embla__button--prev ${!enabled ? 'disabled' : ''}`}
    onClick={onClick}
    aria-disabled={!enabled}
  >
    <ChevronLeftIcon className="embla__button__svg" />
  </button>
);

export const NextButton = ({ enabled, onClick }) => (
  <button
    className={`embla__button embla__button--next ${!enabled ? 'disabled' : ''}`}
    onClick={onClick}
    aria-disabled={!enabled}
  >
    <ChevronRightIcon className="embla__button__svg" />
  </button>
);

import { useEffect, useRef, useState } from 'react'
import styles from './Accordion.module.css'
import { Check, ChevronDown, ChevronUp, Plus } from 'lucide-react'

export const Accordion = ({ children, className, label, isActive, updateHeight }) => {
  const contentRef = useRef()
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!isActive) setOpen(false)
  }, [isActive])

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [updateHeight])

  return (
    <div
      className={`
        ${styles.accordion} 
        ${className} 
        ${open ? styles.open : ""} 
        ${isActive ? styles.active : ""}`}
    >
      <div
        onClick={() => setOpen(!open)}
        className={styles.accordionHeader}>
        <span>{label}</span>
        {
          isActive ?
            <Check strokeWidth={1.75} />
            :
            open ?
              <ChevronUp size={24} strokeWidth={1.75} />
              :
              <Plus size={22} strokeWidth={1.75} />
        }
      </div>
      <div
        ref={contentRef}
        className={styles.accordionBody}
        style={{
          maxHeight: open ? `${height}px` : "0px"
        }}
      >
        <div className={styles.accordionBodyInner}>
          {children}
        </div>
      </div>
    </div>
  )
}


import { useEffect, useId, useRef, useState } from 'react'
import { ACCEPT_FOTOS, motivoDeRechazo } from '../../../helpers/aportes/subirFoto'

/**
 * Zona para elegir o soltar una imagen (fase previa a subida / inferencia).
 */
export default function ImageFilePicker({
  label,
  hint,
  file,
  onFileChange,
  disabled = false,
}) {
  const inputId = useId()
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const aplicarArchivo = (lista) => {
    const archivo = lista?.[0]
    if (!archivo) return
    const rechazo = motivoDeRechazo(archivo)
    if (rechazo) {
      setError(rechazo)
      return
    }
    setError(null)
    onFileChange(archivo)
  }

  const abrirSelector = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const quitar = (e) => {
    e.stopPropagation()
    setError(null)
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className='id-especie-picker'>
      <p className='id-especie-picker__label' id={`${inputId}-label`}>
        {label}
      </p>
      {hint ? <p className='id-especie-picker__hint'>{hint}</p> : null}

      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={`${inputId}-label`}
        aria-disabled={disabled}
        className={[
          'id-especie-picker__zone',
          dragOver ? 'id-especie-picker__zone--over' : '',
          previewUrl ? 'id-especie-picker__zone--filled' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={abrirSelector}
        onKeyDown={(e) => {
          if (disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            abrirSelector()
          }
        }}
        onDragOver={(e) => {
          if (disabled) return
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (disabled) return
          aplicarArchivo(e.dataTransfer?.files)
        }}
      >
        {previewUrl ? (
          <>
            <img className='id-especie-picker__preview' src={previewUrl} alt='' />
            <div className='id-especie-picker__overlay'>
              <span className='id-especie-picker__filename'>{file?.name}</span>
              <button type='button' className='id-especie-picker__clear' onClick={quitar}>
                Quitar
              </button>
            </div>
          </>
        ) : (
          <div className='id-especie-picker__empty'>
            <span className='id-especie-picker__icon' aria-hidden>
              📷
            </span>
            <p>
              <strong>Seleccionar archivo</strong> o soltar aquí
            </p>
            <p className='id-especie-picker__formats'>JPG, PNG o WebP</p>
          </div>
        )}
      </div>

      {error ? (
        <p className='id-especie-picker__error' role='alert'>
          {error}
        </p>
      ) : null}

      <input
        id={inputId}
        ref={inputRef}
        type='file'
        accept={ACCEPT_FOTOS}
        hidden
        disabled={disabled}
        onChange={(e) => {
          aplicarArchivo(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}

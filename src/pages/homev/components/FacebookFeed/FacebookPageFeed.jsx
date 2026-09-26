import { useEffect, useRef } from 'react'
import { ARBU_FACEBOOK_PAGE_URL } from '../../../../constants/arbuSocialLinks'
import { loadFacebookSdk } from '../../../../utils/loadFacebookSdk'
import styles from './FacebookPageFeed.module.css'

export const FacebookPageFeed = () => {
  const widgetRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    loadFacebookSdk()
      .then((FB) => {
        if (cancelled || !FB || !widgetRef.current) return
        FB.XFBML.parse(widgetRef.current)
      })
      .catch(() => {
        /* El plugin puede fallar con bloqueadores; el enlace de respaldo sigue visible */
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className={styles.section} aria-labelledby='facebook-feed-title'>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id='facebook-feed-title'>Novedades en Facebook</h2>
          <p>
            Últimas publicaciones de{' '}
            <a href={ARBU_FACEBOOK_PAGE_URL} target='_blank' rel='noopener noreferrer'>
              Arbu en Facebook
            </a>
            .
          </p>
        </header>

        <div className={styles.widgetWrap} ref={widgetRef}>
          <div
            className='fb-page'
            data-href={ARBU_FACEBOOK_PAGE_URL}
            data-tabs='timeline'
            data-width='500'
            data-height='620'
            data-small-header='false'
            data-adapt-container-width='true'
            data-hide-cover='false'
            data-show-facepile='true'
          />
        </div>

        <p className={styles.fallback}>
          ¿No ves las publicaciones?{' '}
          <a href={ARBU_FACEBOOK_PAGE_URL} target='_blank' rel='noopener noreferrer'>
            Abrir la página en Facebook
          </a>
        </p>
      </div>
    </section>
  )
}

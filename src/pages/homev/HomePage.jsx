import { useRef } from 'react';
import { About } from './components/About/About';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Fetures/Features';
import styles from './HomePage.module.css';
import { Banner } from './components/Banner/Banner';
import { Editions } from './components/Editions/Editions';
import Footer from '../../components/footer/Footer';
import { useReveal } from './useReveal';

export const HomePage = () => {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <div className={styles.homePage} ref={ref}>
      <Hero />
      <About />
      <Features />
      <Banner />
      <Editions />
      <Footer />
    </div>
  )
}

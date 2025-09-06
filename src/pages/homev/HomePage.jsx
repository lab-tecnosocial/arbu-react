import { About } from './components/About/About';
import { Alliances } from './components/Alliances/Alliances';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Fetures/Features';
import styles from './HomePage.module.css';
import { Banner } from './components/Banner/Banner';
import Footer from '../../components/footer/Footer';

export const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Hero />
      <Alliances />
      <About />
      <Features />
      <Banner />
      <Footer />
    </div>
  )
}


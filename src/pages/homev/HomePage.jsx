import { About } from './components/About/About';
import { Alliances } from './components/Alliances/Alliances';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Fetures/Features';
import styles from './HomePage.module.css';
import { Banner } from './components/Banner/Banner';
import { Editions } from './components/Editions/Editions';
import { FacebookPageFeed } from './components/FacebookFeed/FacebookPageFeed';
import Footer from '../../components/footer/Footer';

export const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Hero />
      {/* <Alliances /> */}
      <About />
      <Features />
      <FacebookPageFeed />
      <Banner />
      <Editions />
      <Footer />
    </div>
  )
}


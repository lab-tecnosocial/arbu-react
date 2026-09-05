import { useState } from "react";
import { Button } from "../button/Button";
import { BookMarked, FolderCode, Map, Medal, Menu, X, User } from "lucide-react"
import styles from "./Navbar.module.css"
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authLogout } from "../../actions/auth.actions";
import { ThemeToggle } from "../theme/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

export const Navbar = ({
  logo = "Logo.png",
  iconProps = { size: 20, strokeWidth: 1.75 }
}) => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { uid } = useSelector((state) => state.auth)
  const { resolvedTheme } = useTheme();
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);
  const brandLogo = resolvedTheme === "dark" ? "logodark.png" : logo;

  const links = [
    {
      label: "Mapa",
      href: "/mapa",
      icon: <Map size={iconProps.size} strokeWidth={iconProps.strokeWidth} />,
    },
    {
      label: "Ranking",
      href: "/ranking",
      icon: <Medal size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
    },
    {
      label: "Aprende",
      href: "/aprende",
      icon: <BookMarked size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
    },
    {
      label: "Api",
      href: "/api",
      icon: <FolderCode size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
    },
  ];

  const getProfileOrDownload = (className = '') => uid ? (
    <div className={styles.profileContainer}>
      <button className={`${styles.profileButton} ${className}`} onClick={() => setProfileOpen(!profileOpen)}>
        <User size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
        <span>Mi Perfil</span>
      </button>
      {profileOpen && (
        <div className={styles.profileDropdown}>
          <Link to="/perfil" onClick={() => { setProfileOpen(false); setIsMenuOpen(false); }}>Ver perfil</Link>
          <button onClick={() => { dispatch(authLogout()); setProfileOpen(false); setIsMenuOpen(false); }}>Cerrar sesión</button>
        </div>
      )}
    </div>
  ) : (
    <Button className={className} icon={<img src="icons/googleplay.png" alt="" />}>
      <a target="_blank" rel="noopener noreferrer" style={{ color: 'white' }} href="https://play.google.com/store/apps/details?id=org.labtecnosocial.arbu.android&pcampaignid=web_share">
        Descargar Arbu
      </a>
    </Button>
  );

  const NavbarDesktop = () => (
    <nav className={styles.navbar}>
      <div className={styles.navbarWrapperDesktop}>
        <Link to={'/'} className={styles.logo}>
          {brandLogo ? <img src={brandLogo} alt="Logo Arbu" /> : <span>MiApp</span>}
        </Link>
        <ul className={styles.navLinks}>
          {links.map((link) => (
            <li key={link.href}>
              <Link to={link.href} className={`${styles.navLink} ${location.pathname === link.href ? styles.active : ""}`}>
                {link.icon && <span className={styles.icon}>{link.icon}</span>}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <ThemeToggle iconProps={iconProps} />
          {getProfileOrDownload(styles.ctoButton)}
        </div>
      </div>
    </nav>
  );

  const NavbarMobile = () => (
    <nav className={styles.navbar}>
      <div className={styles.navbarWrapperMobile}>
        <Link to={'/'} className={styles.logo}>
          {brandLogo ? <img src={brandLogo} alt="Logo Arbu" /> : <span>MiApp</span>}
        </Link>
        <div className={styles.mobileActions}>
          <ThemeToggle iconProps={iconProps} />
          <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={iconProps.size} strokeWidth={iconProps.strokeWidth} /> : <Menu size={iconProps.size} strokeWidth={iconProps.strokeWidth} />}
          </button>
        </div>
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
          {links.map((link) => (
            <li key={link.href}>
              <Link to={link.href} className={`${styles.navLink} ${location.pathname === link.href ? styles.active : ""}`} onClick={() => setIsMenuOpen(false)}>
                {link.icon && <span className={styles.icon}>{link.icon}</span>}
                {link.label}
              </Link>
            </li>
          ))}
          {getProfileOrDownload(styles.ctoButtonMobile)}
        </ul>
      </div>
    </nav>
  );

  return (
    <>
      {NavbarDesktop()}
      {NavbarMobile()}
    </>
  );
};

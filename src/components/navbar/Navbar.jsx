import { Button } from "../button/Button";
import { BookMarked, FolderCode, Map, Medal } from "lucide-react"
import styles from "./Navbar.module.css"
import { Link, useLocation } from "react-router-dom";

export const Navbar = ({
  logo = "Logo.png",
  iconProps = { size: 20, strokeWidth: 1.75 }
}) => {
  const location = useLocation()

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

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarWrapper}>
        <Link to={'/'} className={styles.logo}>
          {logo ? <img src={logo} alt="Logo Arbu" /> : <span>MiApp</span>}
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
        <Button icon={<img src="icons/googleplay.png" alt="" />}>
          <a target="_blank" rel="noopener noreferrer" style={{ color: 'white' }} href="https://play.google.com/store/apps/details?id=org.labtecnosocial.arbu.android&pcampaignid=web_share">
            Descargar Arbu
          </a>
        </Button>
      </div>
    </nav>
  );
};

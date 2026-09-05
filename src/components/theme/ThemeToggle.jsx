import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export const ThemeToggle = ({ iconProps = { size: 20, strokeWidth: 1.75 } }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <Sun size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
      ) : (
        <Moon size={iconProps.size} strokeWidth={iconProps.strokeWidth} />
      )}
    </button>
  );
};

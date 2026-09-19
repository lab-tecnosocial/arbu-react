import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { ThemeProvider } from './context/ThemeContext.jsx';

// En desarrollo no debe haber service worker: sirve una mezcla de código nuevo
// y cacheado y acabas depurando un bug que ya no existe. Desactivarlo en la
// configuración no basta, porque un SW ya instalado sobrevive a ese cambio, así
// que aquí se limpia lo que hubiera quedado de antes.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
  if (window.caches) {
    caches.keys().then((claves) => claves.forEach((c) => caches.delete(c)));
  }
}

// En producción, con registerType 'autoUpdate', el service worker nuevo toma el
// control solo, pero la pestaña ya abierta se queda con el código viejo hasta la
// siguiente recarga: por eso un despliegue parecía "no llegar". Al cambiar de
// controlador, recargamos una vez.
//
// La guarda de `controller` distingue el relevo de una versión nueva (había un
// SW y lo sustituye otro) de la primera instalación (no había ninguno), que no
// necesita recarga.
if (!import.meta.env.DEV && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
  let recargando = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recargando) return;
    recargando = true;
    window.location.reload();
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);

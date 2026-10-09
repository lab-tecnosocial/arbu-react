import { Component } from "react";

/**
 * Sin esto, cualquier excepción en el mapa o en la ficha deja la página en
 * blanco. Con esto, el resto de la interfaz sigue en pie.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: "1rem", color: "var(--geyser-800, #4a5a5a)" }}>
            No se pudo cargar esta sección. Recarga la página para intentarlo de nuevo.
          </div>
        )
      );
    }
    return this.props.children;
  }
}

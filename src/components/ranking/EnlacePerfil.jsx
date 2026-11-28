import { Link } from "react-router-dom"

export function EnlacePerfil({ id, className, children }) {
  if (!id) return <div className={className}>{children}</div>

  return (
    <Link to={`/perfil/${id}`} className={className} title="Ver perfil">
      {children}
    </Link>
  )
}

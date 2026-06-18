import { Link, useLocation } from 'react-router-dom'
import { Leaf } from 'lucide-react'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar bg-base-100 border-b border-base-300 px-6">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <Leaf size={22} />
          FoodHealth
        </Link>

        <div className="flex gap-2">
          <Link
            to="/"
            className={`btn btn-sm ${isActive('/') ? 'btn-primary' : 'btn-ghost'}`}
          >
            Accueil
          </Link>
          <Link
            to="/usages"
            className={`btn btn-sm ${isActive('/usages') ? 'btn-primary' : 'btn-ghost'}`}
          >
            Consulter
          </Link>
          <Link
            to="/ajouter"
            className={`btn btn-sm ${isActive('/ajouter') ? 'btn-primary' : 'btn-ghost'}`}
          >
            Ajouter
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
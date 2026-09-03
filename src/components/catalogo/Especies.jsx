import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveEspecie, startLoadEspeciesCatalogo } from '../../actions/catalogoActions';
import './Especies.css';

const Especies = () => {
  const dispatch = useDispatch();
  const { especies } = useSelector(state => state.catalogo);
  
  const [usuarios, setUsuarios] = useState([]);
  const [tablaUsuarios, setTablaUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // Corregido: de [""] a ""
  const [filtroOrigen, setFiltroOrigen] = useState("Todos"); // Nuevo estado para el filtro

  // Función unificada para filtrar por texto y por origen
  const aplicarFiltros = (texto, origen) => {
    let resultados = tablaUsuarios.filter(elemento => {
      // Coincidencia por texto (nombre común, científico o descripción)
      const busc = texto.toLowerCase();
      const coincideTexto = 
        (elemento.nombreComun || '').toLowerCase().includes(busc) ||
        (elemento.nombreCientifico || '').toLowerCase().includes(busc) ||
        (elemento.descripcion2 || '').toLowerCase().includes(busc);
      
      // Coincidencia por origen
      const coincideOrigen = (origen === "Todos") || (elemento.origen === origen);

      return coincideTexto && coincideOrigen;
    });
    setUsuarios(resultados);
  };

  const handleChangeBusqueda = e => {
    const valor = e.target.value;
    setBusqueda(valor);
    aplicarFiltros(valor, filtroOrigen);
  };

  const handleCambiarFiltro = () => {
    // Ciclo simple: Todos -> Nativa -> Introducida -> Todos
    let nuevoFiltro;
    if (filtroOrigen === "Todos") nuevoFiltro = "Nativa";
    else if (filtroOrigen === "Nativa") nuevoFiltro = "Introducida";
    else nuevoFiltro = "Todos";

    setFiltroOrigen(nuevoFiltro);
    aplicarFiltros(busqueda, nuevoFiltro);
  };

  const handleClickEspecie = (usuario) => {
    dispatch(setActiveEspecie(usuario));
  };
  
  useEffect(() => {
    dispatch(startLoadEspeciesCatalogo());
  }, [dispatch]);

  useEffect(() => {
    if (especies && especies.length > 0) {
      setUsuarios(especies);
      setTablaUsuarios(especies);
    }
  }, [especies]);


  return (
    <section className='catalogo-wrapper'>
      <div className='catalogo-search-row'>
        {/* Botón de filtro ahora funcional */}
        <button 
          className={`filter-chip ${filtroOrigen !== 'Todos' ? 'active-filter' : ''}`} 
          type='button'
          onClick={handleCambiarFiltro}
        >
          <TuneIcon sx={{ fontSize: '1rem' }} />
          {filtroOrigen === "Todos" ? "Filtrar" : `Origen: ${filtroOrigen}`}
        </button>

        <div className='search-box'>
          <input
            className='form-control inputBuscar'
            value={busqueda}
            placeholder='Buscar...'
            onChange={handleChangeBusqueda}
          />
          <SearchIcon sx={{ color: '#777' }} />
        </div>

        <button className='btn-success' type='button' onClick={() => aplicarFiltros(busqueda, filtroOrigen)}>
          Buscar
        </button>
      </div>

      <div className='container-primary'>
        {usuarios && usuarios.map((usuario) => (
          <article
            key={usuario.id}
            className='container-catalogo'
            onClick={() => handleClickEspecie(usuario)}
          >
            <figure>
              <img
                src={usuario.imagenesUri[0]}
                alt={usuario.nombreComun}
                referrerPolicy='no-referrer'
              />
            </figure>

            <div className='container-text-icon'>
              <div className='text-arbol'>
                <h2 className='titles'>{usuario.nombreComun}</h2>
                <p className='text-normal descripcion'>{usuario.descripcion2}</p>
              </div>

              <div className='container-icon-info'>
                <span className={`origin-badge ${usuario?.origen === 'Nativa' ? 'nativa' : 'introducida'}`}>
                  {usuario?.origen}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Especies;
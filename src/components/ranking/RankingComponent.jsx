import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChildComponent from './ChildComponent';
import ThreePositionsMes from './ThreePositionsMes';
import ThreePositionsGlobal from './ThreePositionsGlobal';
import Footer from '../footer/Footer';
import { loadScoresGlobal, loadScoresMes } from '../../actions/leaderboardActions';
import { startLoadingUsuarios } from '../../actions/mapaActions';
import './RankingComponent.css';

const RankingComponent = () => {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const { usuariosMap } = useSelector((state) => state.mapa);
  const { scoresGlobal, scoresMes } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(startLoadingUsuarios());
    dispatch(loadScoresMes());
    dispatch(loadScoresGlobal());
  }, [dispatch]);

  const getUserPhoto = (id) => {
    if (usuariosMap && Object.prototype.hasOwnProperty.call(usuariosMap, id)) {
      return usuariosMap[id]?.imageProfile || 'default';
    }

    return 'default';
  };

  const getUserInstitucion = (id) => {
    if (usuariosMap && Object.prototype.hasOwnProperty.call(usuariosMap, id)) {
      return usuariosMap[id]?.institucion;
    }

    return 'default';
  };

  const getFullNameUser = (id) => {
    if (usuariosMap && Object.prototype.hasOwnProperty.call(usuariosMap, id)) {
      return usuariosMap[id]?.nombre;
    }

    return '';
  };

  const getFormattedList = (scoresList) => {
    if (!Array.isArray(scoresList) || scoresList.length === 0) {
      return [];
    }

    return scoresList.map((element, index) => ({
      nombre: getFullNameUser(element.id) || `Usuario ${String(index + 1).padStart(2, '0')}`,
      foto: getUserPhoto(element.id),
      institucion: getUserInstitucion(element.id),
      puntos: element.puntos,
    }));
  };

  const monthlyList = getFormattedList(scoresMes);
  const globalList = getFormattedList(scoresGlobal);
  const isGlobalTab = value === 0;
  const activeList = isGlobalTab ? globalList : monthlyList;
  const hasActiveRanking = activeList.length > 0;
  const ActiveTopThree = isGlobalTab ? ThreePositionsGlobal : ThreePositionsMes;
  const activeTitle = isGlobalTab ? 'Top 100' : 'Top 30';
  const activeSubtitle = isGlobalTab
    ? 'El tablón global se actualiza todos los días a las 00:00 A.M.'
    : 'El ranking mensual se actualiza con la actividad del mes en curso.';
  const emptyMessage = isGlobalTab
    ? 'No hay usuarios compitiendo en el ranking global por el momento.'
    : 'No hay usuarios compitiendo en el ranking mensual por el momento.';
  const activeLimit = isGlobalTab ? 100 : 30;
  const rowSuffix = isGlobalTab ? 'global' : 'mes';

  const renderRows = (list, limit, offset, suffix) =>
    list.slice(3, limit).map((item, index) => (
      <ChildComponent
        key={`${item.nombre}-${suffix}-${index}`}
        nombre={item.nombre}
        puntos={item.puntos}
        foto={item.foto}
        institucion={item.institucion}
        index={offset + index}
      />
    ));

  return (
    <div className="ranking-page">
      <div className="ranking-shell">
        <div className="ranking-tabs" role="tablist" aria-label="Ranking tabs">
          <button
            type="button"
            className={`ranking-tab ${isGlobalTab ? 'is-active' : ''}`}
            onClick={() => setValue(0)}
            aria-pressed={isGlobalTab}
          >
            Global
          </button>
          <button
            type="button"
            className={`ranking-tab ${!isGlobalTab ? 'is-active' : ''}`}
            onClick={() => setValue(1)}
            aria-pressed={!isGlobalTab}
          >
            Mes
          </button>
        </div>

        <section className="ranking-panel">
          <div className="ranking-header">
            <h2>{activeTitle}</h2>
            <p>{activeSubtitle}</p>
          </div>

          {!hasActiveRanking ? (
            <div className="ranking-empty" role="status">
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <>
              <ActiveTopThree list3Best={activeList.slice(0, 3)} />

              <div className="ranking-list">
                {renderRows(activeList, activeLimit, 4, rowSuffix)}
              </div>
            </>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default RankingComponent;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChildComponent from './ChildComponent';
import ThreePositionsMes from './ThreePositionsMes';
import ThreePositionsGlobal from './ThreePositionsGlobal';
import Footer from '../footer/Footer';
import { loadScoresGlobal, loadScoresMes } from '../../actions/leaderboardActions';
import erickImg from '../acerca/team/erick.png';
import patriciaImg from '../acerca/team/patricia.png';
import lourdesImg from '../acerca/team/lourdes.jpg';
import brianImg from '../acerca/team/brian.jpg';
import marianImg from '../acerca/team/marian.png';
import montserratImg from '../acerca/team/montserrat.png';
import luisImg from '../acerca/team/luis.png';
import dayraImg from '../acerca/team/dayra.png';
import './RankingComponent.css';

const demoProfiles = [
  { name: 'Ariel Isaias Ayma Romay', photo: erickImg },
  { name: 'Diana Carolina Marca', photo: patriciaImg },
  { name: 'Pedro Yucra', photo: lourdesImg },
  { name: 'Valeria Peredo', photo: brianImg },
  { name: 'Marian Gil', photo: marianImg },
  { name: 'Montserrat Martinez', photo: montserratImg },
  { name: 'Luis Ugarte', photo: luisImg },
  { name: 'Dayra Estrada', photo: dayraImg },
];

const buildDemoScores = (count, basePoints) =>
  Array.from({ length: count }, (_, index) => {
    const profile = demoProfiles[index % demoProfiles.length];
    const cycle = Math.floor(index / demoProfiles.length);
    return {
      nombre: cycle === 0 ? profile.name : `${profile.name} ${cycle + 1}`,
      foto: profile.photo,
      institucion: 'ARBU Demo',
      puntos: Math.max(basePoints - index * 97, 150),
    };
  });

const demoGlobalScores = buildDemoScores(100, 8925);
const demoMesScores = buildDemoScores(30, 4120);

const RankingComponent = () => {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const { usuariosMap } = useSelector((state) => state.mapa);
  const { scoresGlobal, scoresMes } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(loadScoresMes());
    dispatch(loadScoresGlobal());
  }, [dispatch]);

  const getUserPhoto = (id) => {
    if (usuariosMap && Object.prototype.hasOwnProperty.call(usuariosMap, id)) {
      return usuariosMap[id]?.imageProfile;
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

  const getFormattedList = (scoresList, fallbackList) => {
    if (Array.isArray(scoresList) && scoresList.length > 0) {
      return scoresList.map((element, index) => ({
        nombre: getFullNameUser(element.id) || `Usuario ${String(index + 1).padStart(2, '0')}`,
        foto: getUserPhoto(element.id),
        institucion: getUserInstitucion(element.id),
        puntos: element.puntos,
      }));
    }

    return fallbackList;
  };

  const monthlyList = getFormattedList(scoresMes, demoMesScores);
  const globalList = getFormattedList(scoresGlobal, demoGlobalScores);
  const activeList = value === 0 ? globalList : monthlyList;
  const ActiveTopThree = value === 0 ? ThreePositionsGlobal : ThreePositionsMes;
  const activeTitle = value === 0 ? 'Top 100' : 'Top 30';
  const activeSubtitle =
    value === 0
      ? 'El tablón global se actualiza todos los días a las 00:00 A.M.'
      : 'El ranking mensual se actualiza con la actividad del mes en curso.';
  const activeLimit = value === 0 ? 100 : 30;
  const rowSuffix = value === 0 ? 'global' : 'mes';

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
            className={`ranking-tab ${value === 0 ? 'is-active' : ''}`}
            onClick={() => setValue(0)}
            aria-pressed={value === 0}
          >
            Global
          </button>
          <button
            type="button"
            className={`ranking-tab ${value === 1 ? 'is-active' : ''}`}
            onClick={() => setValue(1)}
            aria-pressed={value === 1}
          >
            Mes
          </button>
        </div>

        <section className="ranking-panel">
          <div className="ranking-header">
            <h2>{activeTitle}</h2>
            <p>{activeSubtitle}</p>
          </div>

          <ActiveTopThree list3Best={activeList.slice(0, 3)} />

          <div className="ranking-list">
            {renderRows(activeList, activeLimit, 4, rowSuffix)}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default RankingComponent;

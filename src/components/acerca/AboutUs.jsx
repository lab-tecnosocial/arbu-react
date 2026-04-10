import React from "react";
import styles from "./AboutUs.module.css";
import { Heart, Target, Globe, Users } from "lucide-react";
import erickImg from "./team/erick.png";
import patriciaImg from "./team/patricia.png";
import lourdesImg from "./team/lourdes.jpg";
import brianImg from "./team/brian.jpg";
import marianImg from "./team/marian.png";
import montserratImg from "./team/montserrat.png";
import luisImg from "./team/luis.png";
import dayraImg from "./team/dayra.png";

const AboutUs = () => {
  const team2024 = [
    { name: "Erick Gomez", role: "Coordinación y Desarrollo", image: erickImg },
    { name: "Patricia Delgadillo", role: "Coordinación y Comunicación", image: patriciaImg },
    { name: "Lourdes Jacinto", role: "Forestal", image: lourdesImg },
    { name: "Brian Tarqui", role: "Desarrollo de Software", image: brianImg },
  ];

  const team2023 = [
    { name: "Erick Gomez", role: "Coordinación y Desarrollo de Software", image: erickImg },
    { name: "Patricia Delgadillo", role: "Coordinación y Comunicación", image: patriciaImg },
    { name: "Marian Gil", role: "Comunicación", image: marianImg },
    { name: "Montserrat Martínez", role: "Comunicación y Marketing", image: montserratImg },
    { name: "Luis Ugarte", role: "Comunicación", image: luisImg },
    { name: "Dayra Estrada", role: "Ciencia de Datos", image: dayraImg },
  ];

  const acknowledgments = [
    {
      category: "Coordinación",
      members: [
        "Alex Ojeda (Coordinación General)",
        "Sarah Jiménez (Coordinación Técnica Forestal)",
      ],
    },
    {
      category: "Desarrollo Arbu App móvil",
      members: [
        "Erick Gomez (Desarrollo Android)",
        "Valeria Peredo (Diseño gráfico y UI)",
      ],
    },
    {
      category: "Desarrollo Arbu web",
      members: ["Erick Gomez", "Pedro Anze"],
    },
    {
      category: "Elaboración del catálogo de especies",
      members: ["Daniela Acebey", "Denis De la Barra", "Irma Quispe"],
    },
  ];

  return (
    <div className={styles.aboutUsContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Acerca de ARBU</h1>
          <p className={styles.heroDescription}>
            Cuidando el Arbolado Urbano para ciudades más sostenibles
          </p>
        </div>
      </section>

      {/* Description Section */}
      <section className={styles.descriptionSection}>
        <div className={styles.sectionContent}>
          <h2>Sobre ARBU</h2>
          <p className={styles.descriptionText}>
            ARBU es una aplicación móvil y web para cuidar el Arbolado Urbano, 
            promoviendo la participación ciudadana en el seguimiento de estado 
            de vida de los árboles mediante funciones de adopción, mapeo y monitoreo. 
            Además de proveer información diversa de especies nativas e introducidas 
            en zonas urbanas.
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className={styles.missionVisionSection}>
        <div className={styles.missionCard}>
          <h3>Misión 🚀</h3>
          <p>
            Construir una plataforma digital que conecte a ciudadanos, comunidades 
            y gobiernos para gestionar el arbolado urbano mediante adopción, mapeo 
            y monitoreo colaborativo, utilizando datos y tecnología para mejorar 
            la salud ambiental de las ciudades.
          </p>
        </div>

        <div className={styles.missionCard}>
          <h3>Visión 🌎</h3>
          <p>
            Convertirnos en la plataforma líder en tecnología ambiental urbana 
            en Bolivia, transformando la gestión del arbolado en un sistema 
            inteligente, colaborativo y basado en datos que impulse ciudades 
            más sostenibles y resilientes.
          </p>
        </div>
      </section>

      {/* Team Section 2024 */}
      <section className={styles.teamSection}>
        <div className={styles.sectionContent}>
          <h2>Nuestro Equipo 2024</h2>
          <div className={styles.teamGrid}>
            {team2024.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.memberAvatar}>
                  {member.image ? (
                    <img src={member.image} alt={member.name} className={styles.memberPhoto} />
                  ) : (
                    <Users size={48} color="#4a9b6f" />
                  )}
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section 2023 */}
      <section className={styles.teamSection}>
        <div className={styles.sectionContent}>
          <h2>Nuestro Equipo 2023</h2>
          <div className={styles.teamGrid}>
            {team2023.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <div className={styles.memberAvatar}>
                  {member.image ? (
                    <img src={member.image} alt={member.name} className={styles.memberPhoto} />
                  ) : (
                    <Users size={48} color="#4a9b6f" />
                  )}
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acknowledgments Section */}
      <section className={styles.acknowledgementsSection}>
        <div className={styles.sectionContent}>
          <h2>Agradecimientos</h2>
          <p className={styles.acknowledgementsSubtitle}>Gestión 2021 - 2022</p>
          <div className={styles.acknowledgementsGrid}>
            {acknowledgments.map((group, index) => (
              <div key={index} className={styles.acknowledgementsCard}>
                <h3>{group.category}</h3>
                <ul>
                  {group.members.map((member, idx) => (
                    <li key={idx}>{member}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Tecno Social */}
      <section className={styles.labSection}>
        <div className={styles.sectionContent}>
          <h2>Iniciativa LabTecnoSocial</h2>
          <p>
            ARBU es una iniciativa del Laboratorio de Tecnologías Sociales 
            (Lab TecnoSocial) en coordinación con especialistas forestales.
          </p>
          <img src="tecnolab.png" alt="Lab Tecno Social" className={styles.labLogo} />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

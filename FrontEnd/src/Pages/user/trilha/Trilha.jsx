import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar/Navbar";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import api from "../../../api";
import styles from "./Trilha.module.css";

const Trilha = () => {
  const { id } = useParams();
  const [trilhaData, setTrilhaData] = useState({
    nome: "",
    desc: "",
    focalPoint: "",
    cargaHora: "",
    image: "",
    conteudo: "",
  });
  const [trilhaSalva, setTrilhaSalva] = useState([]);
  const [isTri, setIsTri] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/trail/trails/${id}`);
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setTrilhaData({
            nome: data.nome,
            desc: data.desc,
            focalPoint: data.focal_point,
            cargaHora: data.carga_horaria,
            image: data.image_trail,
            conteudo: data.conteudo,
          });
          if (data.conteudo) {
            setIsTri(true);
          }
        }
      } catch (error) {
        console.error("Erro na requisição da trilha:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (trilhaData.conteudo) {
      try {
        const parsedConteudo = JSON.parse(trilhaData.conteudo);
        setTrilhaSalva(parsedConteudo);
      } catch (error) {
        console.error("Erro ao analisar conteúdo da trilha:", error);
        setTrilhaSalva([]);
      }
    }
  }, [trilhaData.conteudo]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.cont}>
        <div className={styles.imgMask} style={{ backgroundImage: `url(${trilhaData.image})` }}></div>
        <div className={styles.texts}>
          <div className={styles.title}>
            <h1>{trilhaData.nome}</h1>
          </div>
          <div className={styles.desc}>
            <p>{trilhaData.desc}</p>
          </div>
          <div className={styles.infos}>
            <div className={styles.txt}>
              <h4>Focal Point:</h4>
              <p>{trilhaData.focalPoint}</p>
            </div>
            <div className={styles.txt}>
              <h4>Porcentagem Concluida:</h4>
              <p>50 Horas</p>
            </div>
            <div className={styles.txt}>
              <h4>Carga Horaria:</h4>
              <p>{trilhaData.cargaHora} Horas</p>
            </div>
          </div>
        </div>
      </div>
      {isTri && (
        <div className={styles.contTri}>
          <VerticalTimeline className={styles.trilhaImg}>
            {trilhaSalva.map((elemento, index) => (
              <VerticalTimelineElement
                key={index}
                contentStyle={{
                  background: "#007BC0",
                  color: "#fff",
                  boxShadow: "0px 0px 0px 0px",
                }}
                contentArrowStyle={{ borderRight: "7px solid #007BC0" }}
                iconStyle={{ background: "#007BC0", color: "#fff" }}
              >
                <div className={styles.textsTri}>
                  <h1>{elemento.titulo}</h1>
                </div>
                {elemento.topicos.map((topico, topicoIndex) => (
                  <li key={topicoIndex} className={styles.textsTri} id={styles.topicos}>
                    {topico.link ? (
                      <a href={topico.link} target="_blank" rel="noopener noreferrer" className={styles.links}>{topico.texto}</a>
                    ) : (
                      <span>{topico.texto}</span>
                    )}
                  </li>
                ))}
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      )}
    </div>
  );
};

export default Trilha;

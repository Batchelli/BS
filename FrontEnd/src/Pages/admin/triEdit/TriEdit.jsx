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
import styles from "./TriEdit.module.css";

const TriEdit = () => {
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
            const parsedConteudo = JSON.parse(data.conteudo);
            setTrilhaSalva(parsedConteudo);
          }
        }
      } catch (error) {
        console.error("Erro na requisição da trilha:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleNomeChange = (e) => {
    setTrilhaData((prevData) => ({
      ...prevData,
      nome: e.target.value,
    }));
  };

  const handleDescChange = (e) => {
    setTrilhaData((prevData) => ({
      ...prevData,
      desc: e.target.value,
    }));
  };

  const handleFocalPointChange = (e) => {
    setTrilhaData((prevData) => ({
      ...prevData,
      focalPoint: e.target.value,
    }));
  };

  const handleCargaHoraChange = (e) => {
    setTrilhaData((prevData) => ({
      ...prevData,
      cargaHora: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    // Aqui você pode adicionar lógica para lidar com a alteração da imagem
    // por exemplo, enviar a nova imagem para o servidor e atualizar o estado com a URL da nova imagem
  };

  const handleAddElement = () => {
    const newTrilhaSalva = [...trilhaSalva, { titulo: "", topicos: [] }];
    setTrilhaSalva(newTrilhaSalva);
  };

  const handleAddTopic = (elementIndex) => {
    const newTrilhaSalva = [...trilhaSalva];
    newTrilhaSalva[elementIndex].topicos.push({ texto: "", link: "" });
    setTrilhaSalva(newTrilhaSalva);
  };

  const handleSave = async () => {
    try {
      const updatedTrail = {
        nome: trilhaData.nome,
        desc: trilhaData.desc,
        focal_point: trilhaData.focalPoint,
        criador_trilha: "92902661", // Preencha com o valor apropriado
        carga_horaria: "50", // Preencha com o valor apropriado
        image_trail: "https://firebasestorage.googleapis.com/v0/b/boschskills-2024.appspot.com/o/Imagens%2FTrilha%2Fa4c68d61-3510-4932-87a9-fd3aca0a11f0.jpg?alt=media&token=fc21a3e3-93f7-4e82-b78a-77291d5b232d&quot;", // Preencha com o valor apropriado
        id_prova: 1, // Preencha com o valor apropriado
        conteudo: JSON.stringify(trilhaSalva),
      };
      await axios.put(`${api}/trail/updateTrailInfo/${id}`, updatedTrail);
      alert("Trilha atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar trilha:", error);
      alert("Erro ao salvar trilha. Tente novamente mais tarde.");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.cont}>
        <div
          className={styles.imgMask}
          style={{ backgroundImage: `url(${trilhaData.image})` }}
        ></div>
        <div className={styles.texts}>
          <div className={styles.title}>
            <input
              type="text"
              value={trilhaData.nome}
              onChange={handleNomeChange}
            />
          </div>
          <div className={styles.desc}>
            <input
              type="text"
              value={trilhaData.desc}
              onChange={handleDescChange}
            />
          </div>
          <div className={styles.infos}>
            <div className={styles.txt}>
              <h4>Focal Point:</h4>
              <input
                type="text"
                value={trilhaData.focalPoint}
                onChange={handleFocalPointChange}
              />
            </div>
            <div className={styles.txt}>
              <h4>Porcentagem Concluída:</h4>
              <p>50 Horas</p>
            </div>
            <div className={styles.txt}>
              <h4>Carga Horária:</h4>
              <input
                type="text"
                value={trilhaData.cargaHora}
                onChange={handleCargaHoraChange}
              />
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
                  <input
                    type="text"
                    value={elemento.titulo}
                    onChange={(e) => {
                      const newTrilhaSalva = [...trilhaSalva];
                      newTrilhaSalva[index].titulo = e.target.value;
                      setTrilhaSalva(newTrilhaSalva);
                    }}
                  />
                </div>
                {elemento.topicos.map((topico, topicoIndex) => (
                  <li
                    key={topicoIndex}
                    className={styles.textsTri}
                    id={styles.topicos}
                  >
                    {topico.link ? (
                      <a
                        href={topico.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.links}
                      >
                        {topico.texto}
                      </a>
                    ) : (
                      <input
                        type="text"
                        value={topico.texto}
                        onChange={(e) => {
                          const newTrilhaSalva = [...trilhaSalva];
                          newTrilhaSalva[index].topicos[topicoIndex].texto =
                            e.target.value;
                          setTrilhaSalva(newTrilhaSalva);
                        }}
                      />
                    )}
                  </li>
                ))}
                <button onClick={() => handleAddTopic(index)}>
                  Adicionar Tópico
                </button>
              </VerticalTimelineElement>
            ))}
            <button onClick={handleAddElement}>Adicionar Elemento</button>
          </VerticalTimeline>
        </div>
      )}
      <button className={styles.saveButton} onClick={handleSave}>
        Salvar
      </button>
    </div>
  );
};

export default TriEdit;

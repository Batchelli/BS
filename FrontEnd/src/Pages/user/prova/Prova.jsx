import Navbar from "../../../components/navbar/Navbar";
import styles from "./Prova.module.css";

import axios from "axios";
import api from "../../../api";
import React, { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Prova = () => {
  const [provaData, setProvaData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [resposta, setResposta] = useState([]);

  const handleRadioChange = (event, index, idx) => {
    const { value } = event.target;
    setSelectedOptions(prevState => ({
      ...prevState,
      [`questao_${index}`]: {
        alternativa: value,
        correta: provaData[index].perguntas[idx].respostaCerta,
        questaoIndex: index
      }
    }));
  };

  const request = async () => {
    try {
      const response = await axios.get(`${api}/provas/Prova/3`, {
        params: {
          percentage: "100"
        }
      });

      if (response && response.data && Array.isArray(response.data)) {
        const conteudoProva = response.data[0];
        const formattedData = JSON.parse(conteudoProva.conteudo_prova).map((item) => ({
          enunciado: item.Enunciado,
          perguntas: item.perguntas.map((pergunta) => ({
            alternativas: pergunta.alternativas,
            respostaCerta: pergunta.respostaCerta
          }))
        }));

        setProvaData(formattedData);
      } else {
        console.error("Dados da API estão em um formato inválido:", response);
      }
    } catch (error) {
      console.error("Erro ao obter os dados da API:", error);
    }
  };

  useEffect(() => {
    request();
  }, []);

  const [showContent, setShowContent] = useState(false);

  const handleClick = () => {
    setShowContent(true);
    verificarRespostasCorretas();
  };

  const [numeroRespostasCorretas, setNumeroRespostasCorretas] = useState(0);
  const handleRespostaCorreta = () => {
    setNumeroRespostasCorretas(prevCount => prevCount + 1);
  };

  const verificarRespostasCorretas = () => {
    // Lógica para verificar respostas corretas e contar o número de respostas corretas
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (!value.correta) {
        // Se a resposta estiver errada, mostrar tanto a resposta errada quanto a correta
        const questaoIndex = parseInt(key.split('_')[1]);
        const questao = provaData[questaoIndex];
        setResposta(prevState => ({
          ...prevState,
          [`questao_${questaoIndex}`]: {
            alternativaErrada: value.alternativa,
            respostaCerta: questao.perguntas.find(pergunta => pergunta.respostaCerta).alternativas
          }
        }));
      } else {
        setNumeroRespostasCorretas(prevCount => prevCount + 1);
      }
    });
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.cont}>
        {provaData.map((prova, index) => (
          <div key={index}>
            <h3>Questão {index + 1}: {prova.enunciado}</h3>
            <ul>
              {prova.perguntas.map((pergunta, idx) => (
                <li key={idx}>
                  <label>
                    <input
                      type="radio"
                      name={`questao_${index}`}
                      value={pergunta.alternativas}
                      onChange={(event) => handleRadioChange(event, index, idx)}
                    />
                    {pergunta.alternativas}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h4>Seleções do usuário:</h4>
      <div>
        <div>
          <button onClick={handleClick}>Mostrar Conteúdo</button>
          {showContent && (
            <ul>
              {showContent && (
                <ul>
                  {Object.entries(selectedOptions).map(([key, value]) => {
                    const questaoIndex = parseInt(key.split('_')[1]);
                    const questao = provaData[questaoIndex];
                    return (
                      <li key={key}>
                        <p><strong>Questão {questaoIndex + 1}:</strong> {questao ? questao.enunciado : 'Enunciado não encontrado'}</p>
                        <p>Alternativa selecionada: {value.alternativa}</p>
                        {value.correta ? (
                          <h1>Resposta correta</h1>
                        ) : (
                          <>
                            <h1>Resposta errada</h1>
                            <p>Alternativa errada: {resposta[`questao_${questaoIndex}`].alternativaErrada}</p>
                            <p>Resposta correta: {resposta[`questao_${questaoIndex}`].respostaCerta}</p>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </ul>
          )}
          <p>Número de respostas corretas: {numeroRespostasCorretas}</p>
        </div>
      </div>
    </div>
  );
};

export default Prova;

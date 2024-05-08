import React, { useState, useEffect } from "react";
import styles from "./MakeTest.module.css";
import axios from "axios";
import api from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

import Alert from "/src/components/assets/alert-Black.svg";

const MakeTest = () => {
  const [elements, setElements] = useState([
    {
      titulo: "",
      topicos: [{ texto: "", link: false }],
    },
  ]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(null);
  const [currenttopicoIndex, setCurrenttopicoIndex] = useState(null);
  const [nome_prova, setNomeP] = useState("");
  const [criador_prova, setCriadorP] = useState("");

  const [modalAlert, setModalAlert] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const color = localStorage.getItem("color");

  useEffect(() => {
    setModalAlert(true);
  }, []);

  const closeAlert = () => {
    setModalAlert(false);
  };

  const addElemento = () => {
    if (elements.length >= 10) {
      toast.error("Você atingiu o número máximo de questões (10).", {
        position: "top-right",
      });
      return;
    }
    const novoElemento = {
      titulo: novoTitulo,
      topicos: [],
    };
    setElements([...elements, novoElemento]);
    setNovoTitulo("");
  };

  const enunciados = (e, index) => {
    const novosElementos = [...elements];
    novosElementos[index].titulo = e.target.value;
    setElements(novosElementos);
  };

  const opcoes = (e, index, topicoIndex) => {
    const novosElementos = [...elements];
    novosElementos[index].topicos[topicoIndex].texto = e.target.value;
    setElements(novosElementos);
  };

  const addOp = (index) => {
    if (elements[index].topicos.length >= 5) {
      toast.error("Você atingiu o número máximo de opções por questão (5).", {
        position: "top-right",
      });
      return;
    }
    const novosElementos = [...elements];
    novosElementos[index].topicos.push({ texto: "", link: false });
    setElements(novosElementos);
  };

  const setChose = (index, topicoIndex, checked) => {
    const novosElementos = [...elements];
    if (checked) {
      novosElementos[index].topicos.forEach((topico, i) => {
        if (i !== topicoIndex) {
          topico.link = false;
        }
      });
    }
    novosElementos[index].topicos[topicoIndex].link = checked;
    setElements(novosElementos);
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setCurrentElementIndex(null);
    setCurrenttopicoIndex(null);
  };

  const saveLink = (link) => {
    const novosElementos = [...elements];
    novosElementos[currentElementIndex].topicos[currenttopicoIndex].link = link;
    setElements(novosElementos);
    closeLinkModal();
  };

  const enviarDados = async () => {
    try {
      const conteudoTrilha = elements.map((elemento) => ({
        Enunciado: elemento.titulo,
        perguntas: elemento.topicos.map((topico) => ({
          alternativas: topico.texto,
          respostaCerta: topico.link || false,
        })),
      }));
      await axios.post(`${api}/provas/createProva`, {
        nome_prova: nome_prova,
        criador_prova: criador_prova,
        conteudo_prova: JSON.stringify(conteudoTrilha),
        valor_prova: 10,
        tempoRealizar: 19,
      });
      toast.success("Provada criada com sucesso.", { position: "top-right" });
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      toast.error("Erro ao criar a prova. Tente novamente mais tarde.", {
        position: "top-right",
      });
    }
  };

  const excluirElemento = (index) => {
    const novosElementos = [...elements];
    novosElementos.splice(index, 1); // Remove o elemento na posição 'index'
    setElements(novosElementos);
  };

  const excluirParagrafo = (elementIndex, paragrafoIndex) => {
    const novosElementos = [...elements];
    novosElementos[elementIndex].topicos.splice(paragrafoIndex, 1); // Remove o parágrafo na posição 'paragrafoIndex' do elemento na posição 'elementIndex'
    setElements(novosElementos);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modalBody}>
        {elements.map((elemento, index) => (
          <div
            className={styles.quest}
            key={index}
            style={{ border: `2px solid ${color}` }}
          >
            <div className={styles.btClose}>
              <button
                className={styles.btExcluir}
                onClick={() => excluirElemento(index)}
              >
                ✖
              </button>
            </div>
            <div className={styles.contTitulos}>
              <div className={styles.inpsTri}>
                <input
                  className={styles.inpEnun}
                  type="text"
                  placeholder="Enunciado"
                  value={elemento.titulo}
                  onChange={(e) => enunciados(e, index)}
                  id="titulo"
                />
              </div>
            </div>

            {elemento.topicos.map((paragrafo, topicoIndex) => (
              <div key={topicoIndex}>
                <div className={styles.contItens}>
                  <div className={styles.ifLink}>
                    <div className={styles.inpsTri} id={styles.inpOp}>
                      <input
                        className={styles.inpEnun}
                        placeholder="Respostad"
                        value={paragrafo.texto}
                        onChange={(e) => opcoes(e, index, topicoIndex)}
                      />
                      <button
                        className={styles.btExP}
                        onClick={() => excluirParagrafo(index, topicoIndex)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <div className={styles.check}>
                    <div className={styles.cLink}>
                      <input
                        className={styles.checkB}
                        type="checkbox"
                        checked={paragrafo.link || false}
                        onChange={(e) =>
                          setChose(index, topicoIndex, e.target.checked)
                        }
                      />
                      <p>Resposta correta</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className={styles.contBtAdd}>
              <button className={styles.btAddItem} onClick={() => addOp(index)}>
                Adicionar Opção
              </button>
            </div>
          </div>
        ))}
        <div className={styles.bt}>
          <button onClick={addElemento} className={styles.btAd}>
            + Nova pergunta
          </button>
        </div>
        <div className={styles.saveTri}>
          <button
            className={styles.btSave}
            onClick={enviarDados}
            style={{ backgroundColor: color }}
          >
            Criar prova
          </button>
        </div>
      </div>
      {modalAlert == true && (
        <div className={styles.modalAlertBody}>
          <div className={styles.alertBody}>
            <div className={styles.alertSing}>
              <img src={Alert} alt="" style={{ width: 50 }} />
              <h3>AVISO</h3>
            </div>
            <div className={styles.descAlert}></div>
            <p>
              Caso você feche esta aba sem criar a prova seu progresso sera
              perdido!
            </p>
            <div className={styles.closeAlert}>
              <button className={styles.btExcluir} onClick={closeAlert}>
                ✖
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MakeTest;

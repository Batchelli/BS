import React, { useState, useEffect } from "react";
import styles from "./CriarTri.module.css";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import LinkModal from "../modal/modalLink/LinkModal";
import { HiOutlinePencilAlt } from "react-icons/hi";
import axios from "axios";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import InputImg from "../inputs/inputImg/InputImg";
import Input from "../inputs/inputText/Input";
import ShowTri from "../showTri/ShowTri";
import { jwtDecode } from "jwt-decode";
import LoadinPage from "../loadingPage/LoadingPage";
import MakeTest from "../modal/makeTest/MakeTest";

const CriarTri = () => {
  const [elements, setElements] = useState([]);
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  const [focal_point, setFocal] = useState("");
  const [cargaHora, setCargaHora] = useState("");
  const [image, setImage] = useState(null);
  const [showTri, setShowTri] = useState(false);
  const [load, setLoad] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(null);
  const [currenttopicoIndex, setCurrenttopicoIndex] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [openProva, setOpenProva] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const color = localStorage.getItem("color");

  useEffect(() => {
    if (showTri) {
      localStorage.setItem("trilha", JSON.stringify(elements));
      localStorage.setItem("nome", nome);
      localStorage.setItem("desc", desc);
      localStorage.setItem("focal", focal_point);
      localStorage.setItem("ch", cargaHora);
      localStorage.setItem("imagem", image);
    } else {
      localStorage.removeItem("trilha");
      localStorage.removeItem("nome");
      localStorage.removeItem("desc");
      localStorage.removeItem("focal");
      localStorage.removeItem("ch");
      localStorage.removeItem("imagem");
    }
  }, [showTri]);

  const pos = () => {
    setElements([]);
    setNome("");
    setDesc("");
    setFocal("");
    setCargaHora("");
    setImage(null);
    setImageUrl(null);
  };

  const addElemento = () => {
    const novoElemento = { titulo: "", topicos: [] };
    setElements([...elements, novoElemento]);
  };

  const setTitulos = (e, index) => {
    const novosElementos = [...elements];
    novosElementos[index].titulo = e.target.value;
    setElements(novosElementos);
  };

  const setTextos = (e, index, topicoIndex) => {
    const novosElementos = [...elements];
    novosElementos[index].topicos[topicoIndex].texto = e.target.value;
    setElements(novosElementos);
  };

  const addParagrafo = (index) => {
    const novosElementos = [...elements];
    novosElementos[index].topicos.push({ texto: "", link: false });
    setElements(novosElementos);
  };

  const setLink = (index, topicoIndex, checked) => {
    const novosElementos = [...elements];
    novosElementos[index].topicos[topicoIndex].link = checked;
    setElements(novosElementos);
  };

  const openLinkModal = (index, topicoIndex) => {
    setCurrentElementIndex(index);
    setCurrenttopicoIndex(topicoIndex);
    setShowLinkModal(true);
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

  const openProvaModal = () => {
    setOpenProva(true);
  };

  const closeProvaModal = () => {
    setOpenProva(false);
  };

  const enviarDados = async () => {
    setLoad(true);
    try {
      if (!image) {
        toast.error("Nenhuma imagem selecionada para enviar.", { position: "top-right" });
        return;
      }

      if (elements.length === 0) {
        toast.error("A trilha deve conter pelo menos um elemento.", { position: "top-right" });
        return;
      }

      for (const elemento of elements) {
        if (elemento.titulo.trim() === "") {
          toast.error("O título de um ou mais elementos está vazio.", { position: "top-right" });
          return;
        }
        for (const topico of elemento.topicos) {
          if (topico.texto.trim() === "") {
            toast.error("O texto de um ou mais tópicos está vazio.", { position: "top-right" });
            return;
          }
        }
      }

      const blob = dataURLtoBlob(image);
      const tituloPadronizado = generateImageTitle("jpg");
      const file = new File([blob], tituloPadronizado, { type: "image/jpeg" });
      const imageRef = ref(storage, `Imagens/Trilha/${tituloPadronizado}`);

      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      setImageUrl(url);
      console.log("URL da imagem:", url);

      const conteudoTrilha = elements.map((elemento) => ({
        titulo: elemento.titulo,
        topicos: elemento.topicos.map((topico) => ({
          texto: topico.texto,
          link: topico.link || false,
        })),
      }));

      await axios.post(`${api}/trail/createTrail`, {
        nome: nome,
        desc: desc,
        focal_point: focal_point,
        criador_trilha: decodedToken.edv,
        carga_horaria: cargaHora,
        conteudo: JSON.stringify(conteudoTrilha),
        image_trail: url,
        id_prova: 1,
      });

      toast.success("Trilha criada com sucesso.", { position: "top-right" });
      setLoad(false);
      setShowTri(false);
      pos();
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setLoad(false);
      toast.error("Erro ao criar a trilha. Tente novamente mais tarde.", { position: "top-right" });
    }
  };

  const getArquivo = () => {
    document.getElementById("fileInput").click();
  };

  const setArquivo = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const array = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }

    return new Blob([array], { type: contentType });
  };

  const generateImageTitle = (extension) => {
    const uuid = v4();
    const tituloPadronizado = `${uuid}.${extension}`;
    return tituloPadronizado;
  };

  const excluirElemento = (index) => {
    const novosElementos = [...elements];
    novosElementos.splice(index, 1);
    setElements(novosElementos);
  };

  const excluirParagrafo = (elementIndex, paragrafoIndex) => {
    const novosElementos = [...elements];
    novosElementos[elementIndex].topicos.splice(paragrafoIndex, 1);
    setElements(novosElementos);
  };

  return (
    <div className={styles.container}>
      {showLinkModal && <LinkModal onClose={closeLinkModal} onSave={saveLink} />}
      {!showTri && (
        <div className={styles.contHeader}>
          <div className={styles.contImg}>
            <InputImg onChange={setArquivo} onClick={getArquivo} id="fileInput" image={image} />
          </div>
          <div className={styles.contInps}>
            <div className={styles.inputs}>
              <div className={styles.inps}>
                <Input placeholder="Titulo:" type="text" value={nome} onChange={(e) => setNome(e.target.value)} id="nome" />
              </div>
            </div>
            <div className={styles.descH}>
              <textarea
                className={styles.desc}
                placeholder="Adicionar breve descrição da trilha"
                type="text"
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                id="desc"
              />
            </div>
            <div className={styles.inputs}>
              <div className={styles.inps} id={styles.fp}>
                <Input placeholder="Focal Point:" onChange={(e) => setFocal(e.target.value)} type="text" value={focal_point} id="focalpoint" />
              </div>
              <div className={styles.inps} id={styles.ch}>
                <Input placeholder="Carga Horária:" type="number" onChange={(e) => setCargaHora(e.target.value)} value={cargaHora} id="cargaHora" />
              </div>
            </div>
          </div>
        </div>
      )}
      {!showTri && (
        <VerticalTimeline className={styles.tColor}>
          {elements.map((elemento, index) => (
            <VerticalTimelineElement
              key={index}
              contentStyle={{ background: "#007BC0", color: "#fff", boxShadow: "0px 0px 0px 0px" }}
              contentArrowStyle={{ borderRight: "7px solid #007BC0" }}
              iconStyle={{ background: "#007BC0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
              icon={<button className={styles.btExcluir} onClick={() => excluirElemento(index)}>-</button>}
            >
              <div className={styles.contTitulos}>
                <div className={styles.inpsTri}>
                  <Input className={styles.inpTitulo} type="text" placeholder="Título" value={elemento.titulo} onChange={(e) => setTitulos(e, index)} id="titulo" />
                </div>
              </div>
              {elemento.topicos.map((paragrafo, topicoIndex) => (
                <div key={topicoIndex}>
                  <div className={styles.contItens}>
                    <div className={styles.ifLink}>
                      <div className={styles.inpsTri} id={styles.inpTop}>
                        <Input className={styles.itens} placeholder="Adicionar Texto" value={paragrafo.texto} onChange={(e) => setTextos(e, index, topicoIndex)} />
                      </div>
                      {paragrafo.link && (
                        <div>
                          <button className={styles.btLink} onClick={() => openLinkModal(index, topicoIndex)}>
                            <HiOutlinePencilAlt className={styles.iLink} size={30} />
                          </button>
                        </div>
                      )}
                      <button className={styles.btExP} onClick={() => excluirParagrafo(index, topicoIndex)}>🗑</button>
                    </div>
                    <div className={styles.check}>
                      <div className={styles.cLink}>
                        <input className={styles.checkB} type="checkbox" checked={paragrafo.link || false} onChange={(e) => setLink(index, topicoIndex, e.target.checked)} />
                        <p>Link</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.contBtAdd}>
                <button className={styles.btAddItem} onClick={() => addParagrafo(index)}>+</button>
              </div>
            </VerticalTimelineElement>
          ))}
          <div className={styles.bt}>
            <button onClick={addElemento} className={styles.btAd}>+</button>
          </div>
        </VerticalTimeline>
      )}
      {showTri && (
        <div className={styles.asTrail}>
          <ShowTri showTrilha={setShowTri} />
        </div>
      )}
      <div className={styles.saveTri}>
        <button onClick={openProvaModal} className={styles.btshow} style={{ border: `1px solid ${color}` }}>Abrir Modal</button>
        <button className={styles.btSave} onClick={enviarDados} style={{ backgroundColor: color }}>Salvar Trilha</button>
        {!showTri && (
          <button className={styles.btshow} onClick={() => setShowTri(true)} style={{ border: `1px solid ${color}` }}>Visualizar trilha</button>
        )}
      </div>
      {load && <LoadinPage />}
      {openProva && (
        <div className={styles.bodyModalProva}>
          <div className={styles.close}>
            <div className={styles.closeModal}>
              <button className={styles.btCloseModal} onClick={closeProvaModal}>✖</button>
            </div>
          </div>
          <MakeTest />
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

export default CriarTri;

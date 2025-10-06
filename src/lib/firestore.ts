import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { LegalProcess, LegalDocument } from "./types";
import { fetchFromDatajud } from './datajud';

const LOREM_IPSUM_LONG = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum alique.";
const LOREM_IPSUM_SUMMARY = "Este é um resumo gerado por IA do documento. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export async function addProcessForUser(
  userId: string,
  processNumber: string
): Promise<string> {
  try {
    // 1. Buscar dados do processo na API do Datajud
    const datajudData = await fetchFromDatajud(processNumber);

    // 2. Mapear os dados da API para o nosso modelo LegalProcess
    const newProcess: Omit<LegalProcess, "id"> = {
      userId,
      processNumber,
      parties: datajudData.parties || "Partes não informadas",
      subject: datajudData.subject || "Assunto não informado",
      class: datajudData.class || "Classe não informada",
      area: datajudData.area || "Área não informada",
      date: datajudData.date ? new Date(datajudData.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : "Data não informada",
    };

    // 3. Adicionar o processo principal ao Firestore
    const docRef = await addDoc(collection(db, "processes"), newProcess);

    // 4. Adicionar os documentos (se existirem) como uma subcoleção
    // A API pública não parece retornar os documentos, então esta parte fica como está.
    if (datajudData.documents && datajudData.documents.length > 0) {
      const documentsCollectionRef = collection(db, "processes", docRef.id, "documents");
      for (const document of datajudData.documents) {
        // Mapear dados do documento da API para o nosso modelo LegalDocument
        const newDocument: Omit<LegalDocument, "id"> = {
          name: document.name || "Documento sem nome",
          url: document.url || "#",
          contentText: document.contentText || "Conteúdo não disponível.",
          // O resumo pode ser gerado posteriormente por outra função
        };
        await addDoc(documentsCollectionRef, newDocument);
      }
    }

    return docRef.id;

  } catch (error) {
    console.error("Erro ao adicionar processo via Datajud:", error);
    throw new Error("Não foi possível importar o processo do Datajud.");
  }
}

export async function createSampleProcessForNewUser(
  userId: string
): Promise<string> {
  const sampleProcessNumber = "1234567-89.2024.8.26.0100";
  const newProcess: Omit<LegalProcess, "id"> = {
    userId,
    processNumber: sampleProcessNumber,
    parties: "Empresa ABC Ltda vs. João da Silva",
    subject: "Ação de Cobrança (Exemplo)",
    class: "Procedimento Comum Cível",
    area: "Cível",
    date: "15/05/2024",
  };

  const docRef = await addDoc(collection(db, "processes"), newProcess);

  const documents: Omit<LegalDocument, "id">[] = [
    { name: "Petição Inicial.pdf", url: "#", contentText: `Conteúdo da Petição Inicial: ${LOREM_IPSUM_LONG}`, summary: LOREM_IPSUM_SUMMARY },
    { name: "Contestação.pdf", url: "#", contentText: `Conteúdo da Contestação: ${LOREM_IPSUM_LONG}` },
    { name: "Sentença.pdf", url: "#", contentText: `Conteúdo da Sentença: ${LOREM_IPSUM_LONG}`, summary: LOREM_IPSUM_SUMMARY },
    { name: "Recurso de Apelação.pdf", url: "#", contentText: `Conteúdo do Recurso: ${LOREM_IPSUM_LONG}` },
  ];

  for (const document of documents) {
    await addDoc(collection(db, "processes", docRef.id, "documents"), document);
  }

  return docRef.id;
}


export async function getProcessesForUser(
  userId: string
): Promise<LegalProcess[]> {
  const q = query(collection(db, "processes"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const processes: LegalProcess[] = [];
  querySnapshot.forEach((doc) => {
    processes.push({ id: doc.id, ...doc.data() } as LegalProcess);
  });
  return processes;
}

export async function getProcessDetails(
  processId: string
): Promise<LegalProcess | null> {
  const processRef = doc(db, "processes", processId);
  const processSnap = await getDoc(processRef);

  if (!processSnap.exists()) {
    return null;
  }
  
  const processData = { id: processSnap.id, ...processSnap.data() } as LegalProcess;

  // fetch documents subcollection
  const documentsQuery = query(collection(db, "processes", processId, "documents"));
  const documentsSnapshot = await getDocs(documentsQuery);
  const documents: LegalDocument[] = [];
  documentsSnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() } as LegalDocument);
  });
  
  processData.documents = documents;

  return processData;
}

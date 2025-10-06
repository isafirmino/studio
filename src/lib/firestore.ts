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

const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Proin sed quam. Sed vitae eros ut sapien dictum sollicitudin. Ut vel sapien. Donec et cogo, pellentesque et, rhoncus non, semper est. Sed cuneta, ut sodales quam molestie. Duis porta, turpis at ultrices laoreet, augue diam egestas magna, vitae commodo lacus elit eu arcu. Fusce fermentum, enim sit amet pretium consequat, orci sem semper elit, nec bibendum enim.";

export async function addProcessForUser(
  userId: string,
  processNumber: string
): Promise<string> {
  const newProcess: Omit<LegalProcess, "id"> = {
    userId,
    processNumber,
    parties: "John Doe vs. Jane Smith",
    subject: "Contract Dispute",
    class: "Civil Action",
    area: "Civil",
    date: new Date().toISOString().split("T")[0],
  };

  const docRef = await addDoc(collection(db, "processes"), newProcess);

  // Add mock documents as a subcollection
  const documents: Omit<LegalDocument, "id">[] = [
    { name: "Initial Petition.pdf", url: "#", contentText: `Initial Petition Document: ${LOREM_IPSUM}`, summary: LOREM_IPSUM.substring(0, 200) + '...' },
    { name: "Evidence Submission A.pdf", url: "#", contentText: `Evidence A: ${LOREM_IPSUM}` },
    { name: "Court Ruling.pdf", url: "#", contentText: `Final Ruling: ${LOREM_IPSUM}`, summary: LOREM_IPSUM.substring(0, 150) + '...' },
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

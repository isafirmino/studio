import axios from 'axios';

const API_BASE_URL = 'https://api-publica.datajud.cnj.jus.br';
const TRIBUNAL = 'TJMS'; // Tribunal de Justiça de Mato Grosso do Sul

let jwtToken: string | null = null;
let tokenExpiresAt: number | null = null;

/**
 * Obtém um token JWT para autenticação na API do Datajud.
 * Faz cache do token para evitar requisições repetidas.
 * @returns {Promise<string>} O token JWT.
 */
async function getAuthToken(): Promise<string> {
  if (jwtToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return jwtToken;
  }

  const apiKey = process.env.DATAJUD_API_KEY;

  if (!apiKey || apiKey === 'SUA_CHAVE_DE_API_AQUI') {
    console.error("A chave da API do Datajud não está configurada no arquivo .env");
    throw new Error('API Key do Datajud não configurada.');
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api_publica_token`,
      {},
      {
        headers: {
          'Authorization': `APIKey ${apiKey}`,
        },
      }
    );

    const { access_token, expires_in } = response.data;
    jwtToken = access_token;
    // Armazena o token com um buffer de 60 segundos antes da expiração real
    tokenExpiresAt = Date.now() + (expires_in - 60) * 1000;

    return jwtToken as string;
  } catch (error) {
    console.error('Erro ao obter token de autenticação do Datajud:', error);
    throw new Error('Falha na autenticação com a API do Datajud.');
  }
}

/**
 * Busca dados de um processo na API do Datajud.
 * @param {string} processNumber - O número do processo a ser consultado.
 * @returns {Promise<any>} - Os dados do processo retornados pela API.
 */
export async function fetchFromDatajud(processNumber: string): Promise<any> {
  const token = await getAuthToken();
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${TRIBUNAL}/_search`,
      {
        query: {
          match: {
            numeroProcesso: processNumber,
          },
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const hit = response.data?.hits?.hits?.[0];
    if (!hit) {
      throw new Error('Processo não encontrado no Datajud.');
    }
    
    // Simula a extração de dados que faremos no firestore.ts
    const source = hit._source;
    const classe = source.classe?.nome;
    const assunto = source.assuntos?.map((a: any) => a.nome).join(', ');
    const partes = source.movimentos?.find((m:any) => m.nome === "DISTRIBUIÇÃO")?.complementos?.find((c:any) => c.nome === "Partes")?.valor;

    return {
      parties: partes || "Partes não informadas",
      subject: assunto || "Assunto não informado",
      class: classe || "Classe não informada",
      area: source.area || "Área não informada",
      date: source.dataAjuizamento || new Date().toISOString(),
      documents: [] // A API pública não parece retornar documentos diretamente.
    };

  } catch (error: any) {
    if (error.response) {
      console.error('Erro na busca do processo no Datajud:', error.response.data);
    } else {
      console.error('Erro na busca do processo no Datajud:', error.message);
    }
    throw new Error(`Falha ao buscar dados do processo ${processNumber} no Datajud.`);
  }
}

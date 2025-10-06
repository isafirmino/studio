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

  const apiKey = process.env.NEXT_PUBLIC_DATAJUD_API_KEY;

  if (!apiKey || apiKey === 'SUA_CHAVE_DE_API_AQUI') {
    console.error("A chave da API do Datajud não está configurada no arquivo .env. Lembre-se de prefixar a variável com NEXT_PUBLIC_");
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

function getPartiesFromPolo(polo: any[] | undefined): string {
    if (!polo) return "Partes não informadas";
    
    const poloAtivo = polo.find(p => p.polo === 'AT');
    const poloPassivo = polo.find(p => p.polo === 'PA');

    const nomeAtivo = poloAtivo?.pessoa?.nome || 'Parte Ativa não informada';
    const nomePassivo = poloPassivo?.pessoa?.nome || 'Parte Passiva não informada';

    return `${nomeAtivo} vs. ${nomePassivo}`;
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
      `${API_BASE_URL}/v2/${TRIBUNAL}/_search`,
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
    
    const source = hit._source;

    // Correção no mapeamento dos dados
    const parties = getPartiesFromPolo(source.polo);
    const subject = source.assunto?.find((a:any) => a.principal)?.nome || "Assunto não informado";
    const aClass = source.classe?.nome || "Classe não informada";
    const area = source.area || "Área não informada";
    const date = source.dataAjuizamento; // Retorna a data como está para ser tratada depois


    return {
      parties,
      subject,
      class: aClass,
      area,
      date,
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

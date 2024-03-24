import { connectApi } from "../base/base";

export const getProfile = async (token) => {
    const api = "/v1/usuarios/me?include=privilegios%2Corganizacoes_contratos_ativo";
  
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    return connectApi.get(api, options);
  };



  export const getDashHome = async (token , org_chave) => {
    return connectApi.get(`v1/clientes/baner-logo/organizacao/${org_chave}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };


  export const getProjetos = async (token ,userKey, organizacaoSelecionada ) => {
    return connectApi.get(`v1/contratos?participante=${userKey}&participante_ativo=1&ativo_acesso_conteudo=1&max_per_page=200&include=produto,organizacao,empresa,especialista_responsavel&sort={"by":id, "dir": desc}&organizacao[0]=${organizacaoSelecionada} `, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };


  // return connectApi.get(`v1/contratos?participante=${userKey}&participante_ativo=1&ativo_acesso_conteudo=1&max_per_page=200&include=produto%2Corganizacao%2Cempresa%2Cespecialista_responsavel&sort={"by":id, "dir": desc}&categoria=${categoria}&subcategoria=${subcategoria}`, {
import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { gStyle } from '../constants';

// components
import Cast from '../components/Cast';
import HeaderHome from '../components/HeaderHome';
import PromotionBanner from '../components/PromotionBanner';
import ShowScroller from '../components/ShowScroller';
import { getDashHome, getProfile, getProjetos } from '../data-service/usuario/data-service-usuaroo';

function Home() {
  // on active tab press, scroll to top
  const ref = React.useRef(null);
  useScrollToTop(ref);

  // local state
  const [showHeader, setShowHeader] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const [organizacaoSelecionada, setOrganizacaoSelecionada] = React.useState(null)
  const [organization, setOrganizations] = React.useState(null)

  const [capaEmpresa, setCapaEmpresa] = React.useState(null)
  const [logoEmpresa, setLogoEmpresa] = React.useState(null)
  const [usuario, setUsuario] = React.useState(null)

  const [projetosCategorias , setProjetosComCaregorias] = React.useState(null)

  const token = 'eyJhbGciOiJSUzI1NiJ9.eyJyb2xlcyI6W10sInVzZXJuYW1lIjoiaXNhZWwuc2lsdmEiLCJpYXQiOjE3MTEyODUyNzcsImV4cCI6MTcxMTM3MTY3N30.bV842ckrnPCqGmjBJ-bgS5kZuVNYlSHwCj_jqVYGg-scOaLUV2dI3vyDKOenn0W-LsRtXfKAVWg3YaisjFMdjiHV4wQ73XcYimDuWOxRa6DjJfAoabDNYe4x6n3xnzMAwEtsSuHXIZaKT-OIGcw8McwoqTqxyqVTtEUv2Ca4Hk_5pakb8Ljb6WMyDDkmvRcoFIiPpXmT68UL_U2M2cd01Juqpe5-D3XBe-C48B8g6OsdKrPdNnJutXSh99RrMWEiIat2uPFm7qpeAi71MEGo_Rh-IpEQgzwXXa2b1RvGRId6_vuYAOp7ounRcrr926TmOWDwBvq5WH0tTWHz8hSvorYiPRccFvIaD4ndujd5s0bUNnLSrb1b3Fzqe_mUnIFJWq2k1jzlkoEv2J1APiu7QEQwwPzkkAaF8YIfxGIFYl-9KWq9GS3H_NC0SJtbso7oHJPVr3wD1uSzxC3yh9syWf0C_87D5R9SOWKv-6Z7NsLkqCl7jTHzysTrsWj9OV-zG_D6U9bUuMm_ICZlSxF3gOIqa5m74n_Ao9bkopTU3coelgq98pk-YeIrBLznNvfd9cVzVfptv_KMIlOwqj7jWDHmz9J2ll92Ize4IacHjrepTFHNfe538I3a8Sy2WRZ2eNloqdkb-GtiDUDLN0yCpPebDUpPONS3H8woKmNmzVY	'


  const onScroll = (event) => {
    let show = showHeader;
    const currentOffset = event.nativeEvent.contentOffset.y;
    show = currentOffset < offset;

    if (show !== showHeader || offset <= 0) {
      // account for negative value with "bounce" offset
      if (offset <= 0) show = true;

      setShowHeader(show);
    }

    setOffset(currentOffset);
  };

  async function GetProfilePage() {
    try {
      const value = await getProfile(token);

      const organizations = value.data.result.data.organizacoes_contratos_ativo.data;
      setOrganizations(organizations);
      setOrganizacaoSelecionada(value?.data?.result?.data?.organizacao_selecionada);
      setUsuario(value.data.result)


    } catch (error) {
      console.error(error);
    }
  }




  async function fetchDashHome(orgSelecionada) {
    try {
      if (!orgSelecionada) return;

      const value = await getDashHome(token, orgSelecionada);

      if (value && value.data && value.data.result && value.data.result.length > 0) {
        const firstItem = value.data.result[0];

        if (firstItem) {

          setCapaEmpresa(firstItem.capa.link)
          setLogoEmpresa(firstItem.logo.link)

        } else {
          console.log('O primeiro item é nulo.');
        }
      } else {
        console.log('Nenhum resultado encontrado.');
      }

    } catch (error) {
      console.error('error', error);
    }
  }



  async function fetchProjetosUser(usuario, organizacaoSelecionada) {
    try {
      if (!usuario) return;
  
      const value = await getProjetos(token, usuario?.data?.chave, organizacaoSelecionada);
  
      const agrupadosPorCategoria = {};
      value.data.result.data.forEach((projeto) => {
        let categoria;
  
        // Verifica se o projeto está em andamento
        if (projeto.fracao_concluida_pct > 0) {
          categoria = 'Projetos em andamento';
        } else {
          // Usa a categoria principal se o projeto não estiver em andamento
          categoria = projeto.categoria_principal || 'Outros';  // Trata categoria nula como "Outros"
        }
  
        // Inicializa o array se ainda não existir
        if (!agrupadosPorCategoria[categoria]) {
          agrupadosPorCategoria[categoria] = [];
        }
  
        // Adiciona o projeto na categoria correta
        agrupadosPorCategoria[categoria].push(projeto);
      });
  
      setProjetosComCaregorias(agrupadosPorCategoria);
  
    } catch (error) {
      console.error('error', error);
    }
  }
  

  React.useEffect(() => {
    GetProfilePage();
  }, []);



  React.useEffect(() => {
    if (organizacaoSelecionada) {
      fetchDashHome(organizacaoSelecionada);
    }


  }, [organizacaoSelecionada]);

  React.useEffect(() => {

    if (usuario) {
      fetchProjetosUser(usuario, organizacaoSelecionada);
    }

  }, [usuario]); 




  return (
    <View style={gStyle.container}>
      {/* aqui os links da empresa */}
      <HeaderHome show={showHeader} capaEmpresa={capaEmpresa} logoEmpres={logoEmpresa} />

      <ScrollView
        ref={ref}
        bounces
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Aqui vai ficar o Baner da empresa */}
        <PromotionBanner capaEmpresa={capaEmpresa} />

        {/* <Text style={gStyle.heading}>Ultimos projetos acessado</Text> */}
        {/* <ShowScroller dataset="previews" type="round" /> */}

        {/* {projetosCategorias ? Object.entries(projetosCategorias).map(([projetos]) => ( */}
          {/* <View key={0}>
              <Text style={gStyle.heading}>Continuar projeto</Text>
            <ShowScroller dataset="previews" type="round" projetos={projetosCategorias} />
          </View> */}
        {/* )) : null} */}


        {projetosCategorias ? Object.entries(projetosCategorias).map(([categoria, projetos]) => (
          <View key={categoria}>
            <Text style={gStyle.heading}>{categoria || 'Outros'}</Text>
            <ShowScroller projetos={projetos} categoria={categoria} />
          </View>
        )) : null}


        {/* <Text style={gStyle.heading}>My List</Text> */}
        {/* <ShowScroller dataset="myList" /> */}

        {/* <Text style={gStyle.heading}>Popular on Netflix</Text>
        <ShowScroller />

        <Text style={gStyle.heading}>Trending Now</Text>
        <ShowScroller />

        <Text style={gStyle.heading}>Watch It Again</Text>
        <ShowScroller />

        <Text style={gStyle.heading}>NETFLIX ORIGINALS</Text>
        <ShowScroller />

        <Text style={gStyle.heading}>Documentaries</Text>
        <ShowScroller /> */}

        <View style={gStyle.spacer3} />
      </ScrollView>

      <Cast />
    </View>
  );
}

export default Home;

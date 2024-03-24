import * as React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { colors, gStyle, images } from '../constants';

import mockData from '../mockdata/data';
import { BASE_URL } from '../constants/base';
import { Text } from 'react-native';

function ShowScroller({ dataset, type, projetos, categoria }) {
  const dataArray = projetos;

  return (
    <FlatList
      contentContainerStyle={gStyle.pHHalf}
      data={dataArray}
      horizontal
      keyExtractor={({ id }) => id.toString()}
      renderItem={({ item }) => {

        let estiloItem = categoria === 'Projetos em andamento' ? styles.round : styles[type];
        let estiloImagem = categoria === 'Projetos em andamento' ? styles.roundImage : styles[`${type}Image`];

        let renderItem = <View style={estiloItem} />;

        if (
          item?.produto?.data?.midia &&
          item.produto.data.midia.length > 0 &&
          item.produto.data.midia[0].linkImagem
        ) {
          renderItem = (
            <Image
              source={{ uri: BASE_URL + item.produto.data.midia[0].linkImagem }}
              style={estiloItem}
            />
          );
        } else {
          renderItem = (
            <View
              style={[
                estiloItem,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black'
                }
              ]}
            >
              <Text style={styles.textPlaceholder}>{item?.titulo}</Text>
            </View>
          );
        }

        return renderItem;
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
}
ShowScroller.defaultProps = {
  dataset: 'dumbData',
  type: 'rectangle'
};

ShowScroller.propTypes = {
  // optional
  dataset: PropTypes.string,
  type: PropTypes.string
};

const styles = StyleSheet.create({
  rectangle: {
    backgroundColor: colors.infoGrey,
    height: 131,
    marginRight: 8,
    width: 91
  },
  rectangleImage: {
    height: 131,
    marginRight: 8,
    resizeMode: 'contain',
    width: 91
  },
  round: {
    backgroundColor: colors.infoGrey,
    borderRadius: 48,
    height: 96,
    marginRight: 8,
    width: 96,
    borderWidth: 1, // Ajuste a largura da borda conforme necessário
    borderColor: 'green', // Define a cor da borda como verde
    padding: 4, // Ajuste o espaçamento interno para controlar a proporção da borda visível
  },
  roundImage: {
    height: 96,
    marginRight: 8,
    resizeMode: 'contain',
    width: 96
  },
  textPlaceholder: {
    color: 'white',
    textAlign: 'center',
    fontSize: 7
  }
});

export default ShowScroller;

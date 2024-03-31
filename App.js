import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlowFreeGame from './FlowFreeGame'

const App = () => {
  return (
    <View style={styles.container}>
      <FlowFreeGame />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Altere a cor de fundo conforme necessário
  },
});

export default App;

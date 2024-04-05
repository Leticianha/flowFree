import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons/'

const GRID_SIZE = 5;

const games = [
  [ // Rodada 1
    ['blue', 'white', 'white', 'white', 'yellow'],
    ['green', 'white', 'yellow', 'green', 'white'],
    ['white', 'white', 'white', 'blue', 'white'],
    ['white', 'white', 'white', 'white', 'white'],
    ['red', 'white', 'white', 'white', 'red']
  ],
  [ // Rodada 2
    ['blue', 'red', 'white', 'green', 'white'],
    ['white', 'white', 'white', 'yellow', 'white'],
    ['yellow', 'blue', 'white', 'white', 'white'],
    ['white', 'red', 'white', 'white', 'white'],
    ['white', 'white', 'white', 'white', 'green']
  ],
  [ // Rodada 3
    ['red', 'white', 'white', 'white', 'green'],
    ['white', 'white', 'blue', 'white', 'yellow'],
    ['white', 'white', 'white', 'white', 'yellow'],
    ['white', 'green', 'white', 'white', 'white'],
    ['white', 'white', 'white', 'red', 'blue']
  ],
  [ // Rodada 4
    ['white', 'white', 'white', 'white', 'red'],
    ['white', 'white', 'white', 'white', 'white'],
    ['red', 'white', 'blue', 'green', 'white'],
    ['white', 'white', 'white', 'white', 'yellow'],
    ['yellow', 'blue', 'white', 'white', 'green']
  ],
  [ // Rodada 5
    ['white', 'white', 'yellow', 'green', 'white'],
    ['white', 'white', 'white', 'blue', 'white'],
    ['white', 'white', 'red', 'white', 'white'],
    ['white', 'white', 'blue', 'white', 'white'],
    ['yellow', 'white', 'red', 'green', 'white']
  ]
];

const FlowFreeGame = () => {
  const [currentRound, setCurrentRound] = useState(1); // State to track current round
  const [grid, setGrid] = useState(games[0]); // Initialize grid with the first round game
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [initialCell, setInitialCell] = useState(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Check for win condition when the grid updates
    if (!isRestarting && isWinConditionMet()) {
      setIsModalVisible(true); // Show modal when win condition is met
    }
  }, [grid]);

  const isWinConditionMet = () => {
    // Check if all cells are filled and connected
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 'white') return false;
      }
    }
    return true;
  };

  const isCellFixed = (row, col) => {
    return grid[row][col] === 'white' || (row === initialCell?.row && col === initialCell?.col);
  };

  const handleCellPress = (row, col) => {
    const cellColor = grid[row][col];

    // Check if the cell is already selected
    const isSelectedCell = selectedCells.find(cell => cell.row === row && cell.col === col);

    // Check if the clicked cell is an initial cell and already selected
    const isInitialAndSelected = initialCell && initialCell.row === row && initialCell.col === col && isSelectedCell;

    if (!isInitialAndSelected) {
      if (!isSelectedCell) {
        if (!selectedColor && cellColor !== 'white') {
          setSelectedColor(cellColor);
          setSelectedCells([{ row, col }]);
          setInitialCell({ row, col });
        } else if (cellColor === 'white' && selectedColor) {
          const newGrid = [...grid];
          newGrid[row][col] = selectedColor;
          setGrid(newGrid);
          setSelectedCells([...selectedCells, { row, col }]);
        } else if (cellColor === selectedColor && selectedCells.length > 0) {
          const newGrid = [...grid];
          selectedCells.forEach(cell => {
            newGrid[cell.row][cell.col] = selectedColor;
          });
          setGrid(newGrid);
          setSelectedColor(null);
          setSelectedCells([]);
        } else if (cellColor !== selectedColor && selectedCells.length > 0) {
          const newGrid = [...grid];
          selectedCells.forEach(cell => {
            if (newGrid[cell.row][cell.col] === selectedColor && !(cell.row === initialCell.row && cell.col === initialCell.col)) {
              newGrid[cell.row][cell.col] = 'white';
            }
          });
          setGrid(newGrid);
          setSelectedColor(null);
          setSelectedCells([]);
        }
      } else {
        // If the cell is already selected, deselect it (make it white)
        const newGrid = [...grid];
        newGrid[row][col] = 'white';
        setGrid(newGrid);
        setSelectedCells(selectedCells.filter(cell => !(cell.row === row && cell.col === col)));
      }
    }
  };

  const restartGame = () => {
    // Obter a grade inicial da rodada atual
    const initialRoundGrid = games[currentRound - 1];
  
    // Copiar a grade inicial para evitar mutação direta dos dados
    const newGrid = initialRoundGrid.map(row => [...row]);
  
    // Resetar todas as células modificadas para o estado inicial
    selectedCells.forEach(({ row, col }) => {
      newGrid[row][col] = initialRoundGrid[row][col];
    });
  
    // Resetar o estado do jogo
    setGrid(newGrid);
    setSelectedColor(null);
    setSelectedCells([]);
    setInitialCell(null);
    setIsModalVisible(false); // Ocultar modal ao reiniciar o jogo
  };

  const nextRound = () => {
    if (currentRound < 5) {
      setGrid(games[currentRound]); // Set grid to the next round game
      setSelectedColor(null);
      setSelectedCells([]);
      setInitialCell(null);
      setIsModalVisible(false); // Hide modal
      setCurrentRound(currentRound + 1); // Increment current round
    } else {
      // Game completed all rounds, you can implement what to do here
    }
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((color, colIndex) => (
          <TouchableOpacity
            key={colIndex}
            style={[styles.cell, { backgroundColor: color }]}
            onPress={() => handleCellPress(rowIndex, colIndex)}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>{renderGrid()}</View>
      <TouchableOpacity onPress={restartGame} style={styles.button}>
        <Ionicons size={40} color={"#fff"} name="refresh-outline" />
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Você ganhou a rodada {currentRound}!</Text>
            {currentRound < 5 && (
              <TouchableOpacity onPress={nextRound} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Próxima Rodada</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FlowFreeGame;

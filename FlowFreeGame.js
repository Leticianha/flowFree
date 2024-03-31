import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const GRID_SIZE = 5;

const FlowFreeGame = () => {
  const [grid, setGrid] = useState([
    ['blue', 'white', 'white', 'white', 'yellow'],
    ['green', 'white', 'yellow', 'green', 'white'],
    ['white', 'white', 'white', 'blue', 'white'],
    ['white', 'white', 'white', 'white', 'white'],
    ['red', 'white', 'white', 'white', 'red']
  ]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [initialCell, setInitialCell] = useState(null);

  const handleCellPress = (row, col) => {
    const cellColor = grid[row][col];

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
});

export default FlowFreeGame;

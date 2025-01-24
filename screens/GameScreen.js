import { StyleSheet, View, Alert, FlatList } from 'react-native'
import Title from '../components/ui/Title'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'

import NumberContainer from '../components/game/NumberContainer'
import PrimaryButton from '../components/ui/PrimaryButton'
import InstructionText from '../components/ui/InstructionText'
import Card from '../components/ui/Card'
import GuessLogItem from '../components/game/GuessLogItem'

const generateRandomBetween = (min, max, exclude) => {
  const rndNUm = Math.floor(Math.random() * (max - min)) + min

  if (rndNUm === exclude) {
    return generateRandomBetween(min, max, exclude)
  } else {
    return rndNUm
  }
}
let minBoundary = 1
let maxBoundary = 100

const GameScreen = ({ userNumber, onGameOver }) => {
  const initialGuess = generateRandomBetween(1, 100, userNumber)
  const [currentGuess, setCurrentGuess] = React.useState(initialGuess)
  const [guessRounds, setGuessRounds] = React.useState([initialGuess])

  React.useEffect(() => {
    if (currentGuess === userNumber) {
      onGameOver(guessRounds.length)
    }
  }, [currentGuess, userNumber, onGameOver])

  React.useEffect(() => {
    minBoundary = 1
    maxBoundary = 100
  }, [])

  const nextGuessHandler = (direction) => {
    // lower or greater

    if ((direction === 'lower' && currentGuess < userNumber) || (direction === 'greater' && currentGuess > userNumber)) {
      Alert.alert("Don't lie", 'You know that this is wrong...', [{ text: 'Sorry', style: 'cancel' }])
      return
    }

    if (direction === 'lower') {
      maxBoundary = currentGuess
    } else {
      minBoundary = currentGuess + 1
    }

    const newRndNumber = generateRandomBetween(minBoundary, maxBoundary, currentGuess)
    setCurrentGuess(newRndNumber)
    setGuessRounds((prevGuessRounds) => [newRndNumber, ...prevGuessRounds])
  }

  const guessRoundsListLenght = guessRounds.length

  return (
    <View style={styles.screen}>
      <Title>Opponent's Guess</Title>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card>
        <InstructionText style={styles.instructionText}>Higher or lower</InstructionText>
        <View style={[styles.buttonsContainer, {}]}>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, 'lower')}>
              <Ionicons name="remove" size={24} color="white" />
            </PrimaryButton>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, 'greater')}>
              <Ionicons name="add" size={24} color="white" />
            </PrimaryButton>
          </View>
        </View>
      </Card>
      <View style={styles.listContainer}>
        <FlatList
          data={guessRounds}
          renderItem={(itemData) => <GuessLogItem roundNumber={guessRoundsListLenght - itemData.index} guess={itemData.item} />}
          keyExtractor={(item) => item}
          alwaysBounceVertical={false}
        />
      </View>
    </View>
  )
}

export default GameScreen

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    marginTop: 10,
    alignItems: 'center',
  },
  instructionText: {
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
})

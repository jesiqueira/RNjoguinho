import React from 'react'
import { StyleSheet, ImageBackground, SafeAreaView, View, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Colors from './constants/colors'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import StartGameScreen from './screens/StartGameScreen'
import GameScreen from './screens/GameScreen'
import GameOverScreen from './screens/GameOverScreen'

// Prevenir que a splash screen desapareça automaticamente
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [userNumber, setUserNumber] = React.useState()
  const [gameIsOver, setgameIsOver] = React.useState(true)
  const [appIsReady, setAppIsReady] = React.useState(false)

  React.useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
          'open-sans-bold': require('./assets/fonts/OpenSans-Regular.ttf'),
        })
      } catch (error) {
        console.warn(error)
      } finally {
        setAppIsReady(true)
      }
    }
    prepare()
  }, [])

  const onLayoutRooView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Colors.primary500} />
      </View>
    )
  }

  const pickedNumberHandler = (pickedNumber) => {
    setUserNumber(pickedNumber)
    setgameIsOver(false)
  }

  const gameOverHandle = () => {
    setgameIsOver(true)
  }

  let screen = <StartGameScreen onPickNumber={pickedNumberHandler} />

  if (userNumber) {
    screen = <GameScreen userNumber={userNumber} onGameOver={gameOverHandle} />
  }

  if (gameIsOver && userNumber) {
    screen = <GameOverScreen />
  }

  return (
    <LinearGradient colors={[Colors.primary700, Colors.accent500]} style={styles.rootScreen}>
      <ImageBackground
        source={require('./assets/images/background.png')}
        resizeMode="cover"
        style={styles.rootScreen}
        imageStyle={styles.backgroundImage}
      >
        <SafeAreaView style={styles.rootScreen} onLayout={onLayoutRooView}>
          {screen}
        </SafeAreaView>
      </ImageBackground>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.15,
  },

  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

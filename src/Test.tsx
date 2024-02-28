import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Accordion = ({ title, content }: any) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <View>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text>{title}</Text>
      </TouchableOpacity>
      {expanded && <Text>{content}</Text>}
    </View>
  )
}

const Test = () => {
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('translation')
  const [fontSize, setFontSize] = useState(16)
  const [verses, setVerses] = useState([])
  const [wordQty, setWordQty] = useState({ 0: true, 1: false, 2: false, 3: false })

  useEffect(() => {
    // Load settings from AsyncStorage
    const loadSettings = async () => {
      const storedTheme = await AsyncStorage.getItem('theme')
      const storedLanguage = await AsyncStorage.getItem('language')
      const storedFontSize = await AsyncStorage.getItem('fontSize')
      const storedWordQty = await AsyncStorage.getItem('wordQty')

      if (storedTheme) setTheme(storedTheme)
      if (storedLanguage) setLanguage(storedLanguage)
      if (storedFontSize) setFontSize(parseInt(storedFontSize, 10))
      if (storedWordQty) setWordQty(JSON.parse(storedWordQty))

      try {
        const response = await fetch('https://example.com/mvp.json') // Replace with your actual data URL
        const data = await response.json()
        setVerses(data.verses) // Assuming the data structure matches
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    loadSettings()
  }, [])

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    await AsyncStorage.setItem('theme', newTheme)
  }

  const changeLanguage = async () => {
    const newLanguage =
      language === 'text'
        ? 'transliteration'
        : language === 'transliteration'
        ? 'translation'
        : 'text'
    setLanguage(newLanguage)
    await AsyncStorage.setItem('language', newLanguage)
  }

  const enlargeFont = async (increase: boolean) => {
    const newFontSize = increase ? fontSize + 1 : fontSize - 1
    setFontSize(newFontSize)
    await AsyncStorage.setItem('fontSize', newFontSize.toString())
  }

  // Placeholder for the accordion and main content
  const MainContent = () => {
    return (
      <ScrollView style={{ padding: 10 }}>
        {verses.map((verse, index) => (
          <Accordion key={index} title={`Verse ${index + 1}`} content={verse[language]} />
        ))}
      </ScrollView>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title='MVP' />
        <Button onPress={toggleTheme}>Theme</Button>
        <Button onPress={changeLanguage}>Language</Button>
        <Button onPress={() => enlargeFont(false)}>-</Button>
        <Button onPress={() => enlargeFont(true)}>+</Button>
      </Appbar.Header>
      <MainContent />
    </View>
  )
}

export default Test

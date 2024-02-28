import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SurahViewer = () => {
  const [wordQty, setWordQty] = useState<any>({ 0: true, 1: false, 2: false, 3: false });
  const [language, setLanguage] = useState('translation');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState<number>(16);
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    const fetchVerses = async () => {
      const response = await fetch('https://raw.githubusercontent.com/muhiddinjv/mvp/main/data/mvp.json');
      const data = await response.json();
      const processedVerses = data.verses.map((verse:any, index:any) => {
        const words = verse[language].split(' ');
        if (wordQty[0]) return words.join(' ');

        for (let key in wordQty) {
          if (wordQty[key]) return words.slice(0, key).join(' ');
        }
      });
      setVerses(processedVerses);
    };

    fetchVerses();
  }, [language, wordQty]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = () => {
    const nextLanguage = language === 'text' ? 'transliteration' : language === 'transliteration' ? 'translation' : 'text';
    setLanguage(nextLanguage);
  };

  const enlargeFont = (increase:any) => {
    setFontSize(fontSize + (increase ? 1 : -1));
  };

  const getWords = () => {
    let i = 0;
    let nextWordQty = { ...wordQty }; // Create a copy of wordQty to modify

    for (const key in nextWordQty) {
      if (nextWordQty[key]) {
        nextWordQty[key] = false;
        i = Object.keys(nextWordQty).indexOf(key);
        break; // Exit the loop once the first true value is found and toggled
      }
    }

    const nextKey = Object.keys(nextWordQty)[(i + 1) % Object.keys(nextWordQty).length];
    nextWordQty[nextKey] = true;

    setWordQty(nextWordQty); // Update the state with the modified copy
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#FFF' }]}>
      <Button title="Toggle Words" onPress={getWords} />
      <Button title="Toggle Theme" onPress={toggleTheme} />
      <Button title="Change Language" onPress={changeLanguage} />
      <Button title="Increase Font Size" onPress={() => enlargeFont(true)} />
      <Button title="Decrease Font Size" onPress={() => enlargeFont(false)} />
      <Text style={{ fontSize }}>Verses:</Text>
      {verses.map((verse, index) => (
        <Text key={index} style={{ fontSize }}>
          {verse}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SurahViewer;
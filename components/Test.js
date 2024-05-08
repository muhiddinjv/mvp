function Word({ word }) {
  return <span>{word.text}</span>;
}

function Ayah({ ayah }) {
  return (
    <div>
      <h2>Ayah {ayah.number}</h2>
      {ayah.words.map((word, index) => (
        <span key={index}>
          {word && word.position !== undefined ? (
            <Word key={word.position} word={word} />
          ) : (
            <span>Word not found</span>
          )}
        </span>
      ))}
    </div>
  );
}

function combineVerses(versePositions, verses) {
  const combined = [];
  
  // Iterate over each verse position
  for (let position in versePositions) {
    const surah = versePositions[position].surah;
    const ayah = versePositions[position].ayah;

    // Check if a group for this surah and ayah already exists
    let groupIndex = combined.findIndex(group => group[1].surah === surah && group[1].ayah === ayah);

    // If not, create a new group
    if (groupIndex === -1) {
      combined.push({});
      groupIndex = combined.length - 1;
      combined[groupIndex][1] = { surah, ayah };
    }

    // Add verse to the corresponding group
    combined[groupIndex][position] = verses[position];
  }

  return combined;
}


function useSurahData(translation) {
  const [surahData, setSurahData] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      const responses = await Promise.all([
        fetch(`../data/json/surah-en.json`),
        fetch(`../data/json/surah-inf.json`),
        fetch(`../data/json/word-pos.json`),
        fetch(`../data/json/word-${translation}.json`),
      ]);
      const [surah, suraInf, wordPosition, words] = await Promise.all(
        responses.map((res) => res.json())
      );
      // Combine verses
      const combinedVerses = combineVerses(wordPosition, words);
      console.log(JSON.stringify(combinedVerses))


      const ayahs = Object.values(wordPosition).reduce((acc, word) => {
        if (!acc[word.ayah]) {
          acc[word.ayah] = { number: word.ayah, words: {} };
        }
        acc[word.ayah].words[word.position] = words[word.position];
        return acc;
      }, {});

      const combinedData = {
        name: surah[1].name,
        transliteration: surah[1].name,
        translation: surah[1].translation,
        ...suraInf[1],
        ayahs
      };
      setSurahData(combinedData);
    }
    fetchData();
  }, [translation]);

  return surahData;
}


function Surah({ translation }) {
  const surahData = useSurahData(translation);
  console.log(surahData);
  if (!surahData || !surahData.ayahs) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        {surahData.name} - {surahData.translation}
      </h1>
      {surahData.ayahs.map((ayah, index) => (
        <Ayah key={index} ayah={ayah} />
      ))}
    </div>
  );
}

function Test() {
  return <Surah translation="en" />;
}

/*

{
  "1": {
    "su": 1,
    "sentence": 1,
    "position": 0
  },
  "2": {
    "su": 1,
    "sentence": 1,
    "position": 1
  },
}


[
  {
	"1": "t1",
	"2": "t2",
  },
  {
    "5": "t1",
    "6": "t2",
    "7": "t2",
  }...etc
]

{
		"name": "الفاتحة",
		"nAyah": 7,
		"revelationOrder": 5,
		"type": "meccan",
		"start": 1,
		"end": 7,
    "ayahs": [
      {
      "1": "In (the) name",
      "2": "(of) Allah",
      "3": "the Most Gracious",
      "4": "the Most Merciful",
      },
      {
        "5": "All praises and thanks",
        "6": "(be) to Allah",
        "7": "the Lord",
        "8": "of the universe",
      }
    ]
	}
  
*/

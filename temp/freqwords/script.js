const fs = require('fs');
const path = require('path');

function getMostFrequentWords(data, limit) {
    const frequencyMap = {};

    // Count occurrences of each word and store IDs
    for (const id in data) {
        const word = data[id];
        if (!frequencyMap[word]) {
            frequencyMap[word] = {
                count: 0,
                ids: []
            };
        }
        frequencyMap[word].count++;
        frequencyMap[word].ids.push(id);
    }

    // Convert the frequency map to an array of [word, {count, ids}] pairs
    const frequencyArray = Object.entries(frequencyMap);

    // Sort the array by count in descending order
    frequencyArray.sort((a, b) => b[1].count - a[1].count);

    // Create the result object
    const result = {};
    for (let i = 0; i < Math.min(limit, frequencyArray.length); i++) {
        result[i + 1] = {
            word: frequencyArray[i][0],
            count: frequencyArray[i][1].count,
            ids: frequencyArray[i][1].ids
        };
    }

    return result;
}

export async function loadData() {
    try {
        const [arResponse, enResponse] = await Promise.all([
            fetch("ar.json"),
            fetch("en.json")
        ]);

        const arData = await arResponse.json();
        const enData = await enResponse.json();
        const frequentWords = getMostFrequentWords(arData, 100);
        
        // Enhance the frequent words with English translations
        const enhancedResult = {};
        for (const key in frequentWords) {
            const entry = frequentWords[key];
            const translations = entry.ids.map(id => enData[id] || "Translation not found");
            enhancedResult[key] = {
                arab: entry.word,
                eng: translations[2],
                count: entry.count,
                // ids: entry.ids
            };
        }

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
            <h2>Most Frequent Words</h2>
            <pre>${JSON.stringify(enhancedResult, null, 2)}</pre>
        `;
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function generateJsonFiles(dataArray) {
    dataArray.forEach((item, index) => {
        const fileName = `${index + 1}.json`; // Create file name
        const filePath = path.join(__dirname, fileName); // Set file path

        fs.writeFile(filePath, JSON.stringify(item, null, 2), (err) => {
            if (err) {
                console.error(`Error writing file ${fileName}:`, err);
            } else {
                console.log(`Successfully created ${fileName}`);
            }
        });
    });
}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getMostFrequentWords(filePath, limit) {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Create a frequency map
    const frequencyMap = {};

    // Count occurrences of each word
    for (const key in data) {
        const word = data[key];
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    }

    // Convert the frequency map to an array of [word, count] pairs
    const frequencyArray = Object.entries(frequencyMap);

    // Sort the array by count in descending order
    frequencyArray.sort((a, b) => b[1] - a[1]);

    // Create the result object
    const result = {};
    for (let i = 0; i < Math.min(limit, frequencyArray.length); i++) {
        result[i + 1] = {
            word: frequencyArray[i][0],
            count: frequencyArray[i][1]
        };
    }

    return result;
}

// Example usage
const filePath = path.join(__dirname, 'ar.json'); // safer path
const mostFrequentWords = getMostFrequentWords(filePath, 20);
console.log(mostFrequentWords);

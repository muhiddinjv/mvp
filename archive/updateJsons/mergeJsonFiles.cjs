const fs = require('fs');
const path = require('path');

async function mergeJsonFiles(inputDir, outputFile) {
    const files = fs.readdirSync(inputDir)
        .filter(file => file.endsWith('.json'))
        .map(file => ({ filename: file, id: parseInt(file.replace('.json', ''), 10) }))
        .sort((a, b) => b.id - a.id); // Sort in descending order

    let uniqueArabicSet = new Set();
    let result = {};

    // Process files from Surah 114 down to 1
    for (const { filename, id } of files) {
        const filePath = path.join(inputDir, filename);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let surahData = [];
        let wordId = 1;

        for (const verseKey in fileData) {
            const words = fileData[verseKey].w;
            words.forEach(word => {
                if (!uniqueArabicSet.has(word.ar)) {
                    uniqueArabicSet.add(word.ar);
                    surahData.push({
                        id: wordId++,
                        text: {
                            ar: word.ar,
                            en: word.en,
                            tr: word.tr,
                            ru: word.ru
                        },
                        aud: word.p,
                        img: "/img/book.png"
                    });
                }
            });
        }
        if (surahData.length > 0) {
            result[id.toString()] = surahData;
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Merged JSON saved to ${outputFile}`);
}

// Usage
const inputFolder = path.join(__dirname, 'input');
const outputFile = path.join(__dirname, 'output.json');
mergeJsonFiles(inputFolder, outputFile);

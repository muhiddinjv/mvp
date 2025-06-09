const fs = require('fs');
const path = require('path');

console.log('conversion started');

function convertJsonToCsv() {
    const inputDir = path.join(__dirname, 'input');
    const outputDir = path.join(__dirname, 'output');

    for (let i = 1; i <= 114; i++) {
        const inputFile = path.join(inputDir, `${i}.json`);
        const outputFile = path.join(outputDir, `${i}.csv`);

        try {
            const jsonData = JSON.parse(fs.readFileSync(inputFile));
            const verses = jsonData.verses;

            let csvData = '';
            verses.forEach(verse => {
                csvData += `${verse.id},"${verse.text}","${verse.translation}","${verse.transliteration}"\n`;
            });

            fs.writeFileSync(outputFile, csvData);
        } catch (error) {
            console.error(`Failed to process ${inputFile}:`, error);
        }
    }
}


function generateJsonFiles() {
    const inputFilePath = path.join(__dirname, 'input', 'quran_en.json');
    const outputDir = path.join(__dirname, 'output');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading input file:', err);
            return;
        }

        try {
            const dataArray = JSON.parse(data);

            dataArray.forEach((item, index) => {
                const fileName = `${index + 1}.json`;
                const filePath = path.join(outputDir, fileName);

                fs.writeFile(filePath, JSON.stringify(item, null, 2), (err) => {
                    if (err) {
                        console.error(`Error writing file ${fileName}:`, err);
                    } else {
                        console.log(`Successfully created ${fileName}`);
                    }
                });
            });
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
        }
    });
}

function splitWordsJson() {
    const inputFilePath = path.join(__dirname, 'input', 'words.json');
    const outputDir = path.join(__dirname, 'output');

    // Read the words.json file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Parse the JSON data
        const wordsData = JSON.parse(data);

        // Iterate over the keys (1 to 114)
        for (let i = 1; i <= 114; i++) {
            const fileName = `${i}.json`;
            const filePath = path.join(outputDir, fileName);

            // Write each individual JSON file
            fs.writeFile(filePath, JSON.stringify(wordsData[i.toString()], null, 2), (err) => {
                if (err) {
                    console.error(`Error writing file ${fileName}:`, err);
                } else {
                    console.log(`Successfully created ${fileName}`);
                }
            });
        }
    });
}

// Call the function
splitWordsJson();

console.log('conversion complete');
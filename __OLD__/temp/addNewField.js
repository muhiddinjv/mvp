const fs = require('fs');

function addSajdaField(chapters) {
    const sajdaSurahs = [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96];
    const sajdaAyahs = [206, 15, 50, 109, 58, 18, 60, 26, 15, 24, 38, 62, 21, 19];
    
    // Assuming chapters is an array of objects representing each chapter
    chapters.forEach(chapter => {
        if (sajdaSurahs.includes(chapter.id)) {
            const index = sajdaSurahs.indexOf(chapter.id);
            const sajdaValue = sajdaAyahs[index];
            chapter.sajda = [sajdaValue];
        } else {
            chapter.sajda = null; // Or any default value indicating no sajdah
        }
    });

    return chapters;
}

// Read the chapters JSON file
fs.readFile('chapters.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const chapters = JSON.parse(data);

    const updatedChapters = addSajdaField(chapters);

    // Write the updated chapters back to the JSON file
    fs.writeFile('chapters.json', JSON.stringify(updatedChapters, null, 2), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Chapters JSON file has been updated successfully.');
    });
});
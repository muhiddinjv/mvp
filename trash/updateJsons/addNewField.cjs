const fs = require('fs');
const path = require('path');

function updateFiles() {
  const inputDir = path.join(__dirname, 'input');
  const outputDir = path.join(__dirname, 'output');

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Load the Russian and position files
  const russian = JSON.parse(fs.readFileSync(path.join(__dirname, 'russian.json'), 'utf8'));
  const positions = JSON.parse(fs.readFileSync(path.join(__dirname, 'position.json'), 'utf8'));

  // Build a mapping: "surah_ayah_position" (with zero-based word index) -> position key
  const posMapping = {};
  for (const posKey in positions) {
    if (positions.hasOwnProperty(posKey)) {
      const { surah, ayah, position } = positions[posKey];
      // Use a key like "1_1_0" for surah 1, ayah 1, position 0
      const mapKey = `${surah}_${ayah}_${position}`;
      posMapping[mapKey] = posKey;
    }
  }

  // Process each JSON file in the input folder
  const files = fs.readdirSync(inputDir);
  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(inputDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Each file contains keys like "1_1", "1_2", etc.
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key].w && Array.isArray(data[key].w)) {
          data[key].w.forEach(wordObj => {
            // The "p" field is formatted as "001_001_001"
            const parts = wordObj.p.split('_');
            if (parts.length === 3) {
              // Convert padded strings to numbers; subtract 1 for zero-based index
              const surah = parseInt(parts[0], 10);
              const ayah = parseInt(parts[1], 10);
              const pos = parseInt(parts[2], 10) - 1;
              const lookupKey = `${surah}_${ayah}_${pos}`;
              
              // Find the corresponding Russian translation key
              const rusKey = posMapping[lookupKey];
              if (rusKey && russian[rusKey]) {
                wordObj.ru = russian[rusKey];
              }
            }
          });
        }
      }

      // Write the updated JSON object to the output folder
      const outputFilePath = path.join(outputDir, file);
      fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
    }
  });

  console.log("Files updated successfully!");
}

// updateFiles();

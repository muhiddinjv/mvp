const fs = require('fs');
const path = require('path');

console.log('updating jsons...');
function updateJsons(inputDir, outputDir) {
  // Read all files in the input directory
  const files = fs.readdirSync(inputDir);

  files.forEach(file => {
    // Construct full file paths
    const inputFile = path.join(inputDir, file);
    const outputFile = path.join(outputDir, file);

    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    // Process each object in the data
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const childObj = data[key];
        if (childObj.w && Array.isArray(childObj.w)) {
          childObj.w.forEach((word, index) => {
            if (word.c) {
              word.ar = word.c;
              delete word.c; // Remove the original key "c"
            }
            if (word.d) {
              word.tr = word.d;
              delete word.d; // Remove the original key "d"
            }
            if (word.e) {
              word.en = word.e;
              delete word.e; // Remove the original key "e"
            }
            // Extract the initial number from the filename (assuming the filename format is XXXX.json)
            let initialNumber = path.basename(file, '.json');
            // Check the length of initialNumber and pad accordingly
            if (initialNumber.length === 1) {
              initialNumber = initialNumber.padStart(3, '0'); // Pad with two zeros if it's a single digit
            } else if (initialNumber.length === 2) {
              initialNumber = initialNumber.padStart(3, '0'); // Pad with one zero if it's two digits
            }
            const pageNumber = `${initialNumber}_${key.padStart(3, '0')}_${(index + 1).toString().padStart(3, '0')}`;
            word.p = pageNumber;
          });
        }
      }

      // Convert the updated data to a JSON string
      const jsonStr = JSON.stringify(data, null, 2);

      // Write the updated JSON to the output directory
      fs.writeFileSync(outputFile, jsonStr, 'utf8');
    }});
}

// Assuming the input and output directories are named 'input' and 'output' and are in the current working directory
updateJsons('./input', './output');
console.log('...jsons updated!');

//To run this, open terminal and type: node updateJsons.js ...and hit enter
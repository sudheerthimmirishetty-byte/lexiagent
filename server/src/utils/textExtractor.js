const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromFile = async (filePath, mimeType, originalName) => {
  const ext = path.extname(originalName || filePath).toLowerCase();

  try {
    if (ext === '.pdf' || mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text ? data.text.trim() : '';
    } else if (
      ext === '.docx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value ? result.value.trim() : '';
    } else if (ext === '.txt' || mimeType === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8').trim();
    } else {
      // Fallback text reader
      return fs.readFileSync(filePath, 'utf8').trim();
    }
  } catch (error) {
    console.error(`[TextExtractor Error] Failed to parse ${originalName}:`, error.message);
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
};

module.exports = { extractTextFromFile };

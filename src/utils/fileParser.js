import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
import workerSrc from 'pdfjs-dist/build/pdf.worker?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Parse various file types and extract text
 * Supports: txt, md, pdf, docx, pptx (via json conversion), csv, json, rtf
 */
export async function parseFile(file) {
  const name = file.name.toLowerCase();
  const type = file.type;

  if (name.endsWith('.txt') || name.endsWith('.md')) {
    return await parseText(file);
  } else if (name.endsWith('.pdf')) {
    return await parsePDF(file);
  } else if (name.endsWith('.docx')) {
    return await parseDocx(file);
  } else if (name.endsWith('.pptx')) {
    return await parsePptx(file);
  } else if (name.endsWith('.csv')) {
    return await parseCSV(file);
  } else if (name.endsWith('.json')) {
    return await parseJSON(file);
  } else if (name.endsWith('.rtf')) {
    return await parseRTF(file);
  } else if (type.startsWith('text/')) {
    return await parseText(file);
  } else {
    throw new Error(`File type not supported: ${file.name}`);
  }
}

async function parseText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

async function parsePDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(' ') + '\n';
        }

        resolve(text.trim());
      } catch (err) {
        reject(new Error('Failed to parse PDF: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
}

async function parseDocx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (err) {
        reject(new Error('Failed to parse DOCX: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read DOCX file'));
    reader.readAsArrayBuffer(file);
  });
}

async function parsePptx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const view = new Uint8Array(arrayBuffer);
        let text = '';
        const chunkSize = 8192;
        for (let i = 0; i < view.length; i += chunkSize) {
          const chunk = view.subarray(i, i + chunkSize);
          text += String.fromCharCode(...chunk);
        }
        text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        resolve(text || 'PPTX file parsed but contains limited extractable text');
      } catch (err) {
        reject(new Error('Failed to parse PPTX: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PPTX file'));
    reader.readAsArrayBuffer(file);
  });
}

async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = () => reject(new Error('Failed to read CSV file'));
    reader.readAsText(file);
  });
}

async function parseJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // Convert JSON to readable format
        const text = JSON.stringify(data, null, 2);
        resolve(text);
      } catch (err) {
        reject(new Error('Invalid JSON file: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read JSON file'));
    reader.readAsText(file);
  });
}

async function parseRTF(file) {
  // Basic RTF parsing - strip RTF control words
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target.result;
        // Remove RTF control sequences
        text = text.replace(/\\[a-z]+\d*/g, '');
        // Remove brackets and braces
        text = text.replace(/[{}]/g, '');
        // Clean up whitespace
        text = text.replace(/\s+/g, ' ').trim();
        resolve(text);
      } catch (err) {
        reject(new Error('Failed to parse RTF: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read RTF file'));
    reader.readAsText(file);
  });
}

import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const parseResume = async (file) => {
  let text = '';
  
  try {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + ' ';
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX, we'll use a simpler approach with FileReader
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          // Simple text extraction - in production, you'd want a proper DOCX parser
          const text = reader.result.toString();
          resolve(extractFields(text));
        };
        reader.onerror = () => reject(new Error('Failed to read DOCX file'));
        reader.readAsText(file);
      });
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX files only.');
    }

    return extractFields(text);
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

const extractFields = (text) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const nameRegex = /([A-Z][a-z]+\s+[A-Z][a-z]+)/;

  const email = text.match(emailRegex)?.[0] || '';
  const phone = text.match(phoneRegex)?.[0] || '';
  const name = text.match(nameRegex)?.[0] || '';

  return { name, email, phone };
};
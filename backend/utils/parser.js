import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

export const extractText = async (file) => {
  const mime = file.mimetype;

  console.log("MIME:", mime);

  // PDF
  if (mime === "application/pdf") {
    try{
        const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(file.buffer),
        });

        const pdf = await loadingTask.promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const strings = content.items.map((item) => item.str);
        text += strings.join(" ") + "\n";
        }

        return text;
    }catch(err){
        console.error("PDF_PARSE_ERROR: ",err);
        throw new Error("PDF_PARSE_ERROR: " + (err?.message || JSON.stringify(err)));
    }
  }

  // DOCX
  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        try{
            const result = await mammoth.extractRawText({
            buffer: file.buffer,
            });
            return result.value;
        }catch(err){
            console.error("DOCX_PARSE_ERROR: ",err);
            throw new Error("DOCX_PARSE_ERROR: " + (err?.message || JSON.stringify(err)));
        }
    }

  throw new Error("Unsupported file type");
};
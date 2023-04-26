const fs = require("fs");
const pdf = require("pdf-parse");

async function readPDFFile(filePath: string): Promise<any> {
  const pdfBuffer = fs.readFileSync(filePath);
  const parsedPDF = await pdf(pdfBuffer);
  const pdfText = parsedPDF.text;

  const lines = pdfText.split("\n").slice(5);

  const names = lines
    .filter((line: any) => /^[A-Za-z]/.test(line))
    .map((name: any) => name.replace(/[0-9]/g, ""))
    .map((name: any) => name.slice(1));

  return names;
}

readPDFFile("../pdf/test.pdf");

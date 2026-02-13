export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid initialization issues in serverless
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}

import * as pdfParseModule from "pdf-parse";

// pdf-parse handles both CJS and ESM export styles
const pdfParse = (pdfParseModule as { default?: typeof pdfParseModule } & typeof pdfParseModule).default || pdfParseModule;

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await (pdfParse as any)(buffer);
  return data.text;
}

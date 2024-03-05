import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { env } from "../env";

const { ENVIRONMENT } = env;

const HTML_FOLDER = path.resolve(process.cwd(), "html");
const PDF_FOLDER = path.resolve(process.cwd(), "pdf");

export function generateHtmlFile(html: string) {
  const uuid = randomUUID();
  const filename = uuid + "-output.html";

  const outputPath = path.resolve(HTML_FOLDER, filename);

  if (!fs.existsSync(path.resolve(HTML_FOLDER)))
    fs.mkdirSync(path.resolve(HTML_FOLDER));

  fs.writeFileSync(outputPath, html);

  return filename;
}

export async function generatePdfFromHtmlFile(htmlFilename: string) {
  const filePath = path.join(process.cwd(), "html", htmlFilename);
  try {
    const browser = await puppeteer.launch({
      headless: ENVIRONMENT === "dev" ? false : "new",
      args:
        ENVIRONMENT === "dev"
          ? []
          : ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const html = fs.readFileSync(filePath, { encoding: "utf-8" });
    await page.setContent(html);

    const pdfFilename = randomUUID() + ".pdf";
    const pdfPath = path.resolve(PDF_FOLDER, pdfFilename);

    if (!fs.existsSync(path.resolve(PDF_FOLDER)))
      fs.mkdirSync(path.resolve(PDF_FOLDER));

    await page.pdf({ path: pdfPath });

    await browser.close();

    return pdfPath;
  } catch (err: any) {
    console.log(err);

    throw new Error("[generatePDF]> Houve um erro ao gerar o PDF");
  }
}

export async function generatePdfFromSite(siteUrl: string) {
  try {
    const browser = await puppeteer.launch({
      headless: ENVIRONMENT === "dev" ? false : "new",
      args:
        ENVIRONMENT === "dev"
          ? []
          : ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(siteUrl);

    const pdfFilename = randomUUID() + ".pdf";
    const pdfPath = path.resolve(PDF_FOLDER, pdfFilename);

    if (!fs.existsSync(path.resolve(PDF_FOLDER)))
      fs.mkdirSync(path.resolve(PDF_FOLDER));

    await page.pdf({ path: pdfPath });

    await browser.close();

    return pdfPath;
  } catch (err: any) {
    console.log(err);

    throw new Error("[generatePDF]> Houve um erro ao gerar o PDF");
  }
}

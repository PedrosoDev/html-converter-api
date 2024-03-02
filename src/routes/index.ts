import { Router } from "express";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { generateHtmlFile, generatePdf } from "../utils/utils";

const routes = Router();

routes.get("/html-to-pdf", async (req, res) => {
  try {
    const bodySchema = z.object({
      html: z.string(),
    });

    const { html } = bodySchema.parse(req.body);

    const htmlFilename = generateHtmlFile(html);
    const htmlPath = path.resolve(process.cwd(), "html", htmlFilename);
    const pdfPath = await generatePdf(htmlFilename);

    res.contentType("application/pdf");
    res.download(pdfPath, (err) => {
      if (err) {
        console.error(err);
        throw new Error(
          "[res.download]> Houve um erro ao enviar o PDF para download"
        );
      }

      fs.rm(pdfPath, (err) => {
        if (err) {
          console.error(err);
        }
      });

      fs.rm(htmlPath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  } catch (err: any) {
    return res.status(400).json({
      message: "Houve um erro ao gerar o relatório PDF.",
      err: err.message,
    });
  }
});

export { routes };
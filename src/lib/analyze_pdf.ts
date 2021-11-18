import fetch from "node-fetch";
import pdfjsLib from "pdfjs-dist";
import { spawn } from "child_process";
import { once } from "events";
import { Keywords } from "../models/keyword";

const analyzePdf = async (url: string): Promise<String> => {
  const res = await fetch(url);

  const file = await res.buffer();

  const pdf = await pdfjsLib.getDocument({ data: file });

  let text = await pdf.promise.then(async (doc) => {
    let allText = "";

    for (let i = 0; i < doc.numPages; i++) {
      const page = await doc.getPage(i + 1);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join("");

      allText += pageText;
    }

    return allText;
  });

  return text;

  // Call python3
};

export { analyzePdf };

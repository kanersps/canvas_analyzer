import fetch from "node-fetch";
import pdfjsLib from "pdfjs-dist";
import { spawn } from "child_process";
import { once } from "events";
import { Keywords } from "../models/keyword";

const analyzePdf = async (url: string): Promise<Keywords> => {
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

  // Call python3
  const pythonProcess = spawn("python3", ["./python/keyword_analyze.py", text]);

  let keywords: Keywords = {};

  pythonProcess.stdout.on("data", (data: any) => {
    for (let keyword of JSON.parse(data.toString().replace(/'/g, '"'))) {
      if (keywords[keyword]) {
        keywords[keyword].count++;
      } else {
        keywords[keyword] = { name: keyword, count: 1 };
      }
    }
  });

  await once(pythonProcess, "close");

  return keywords;
};

export { analyzePdf };
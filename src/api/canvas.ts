import { Request, Response } from "express";
import { getCourses } from "./course";
import { getAssignments, getSubmissions } from "./submissions";
import fetch from "node-fetch";
import pdfjsLib from "pdfjs-dist";
import { spawn } from "child_process";
import { once } from "events";

interface Keyword {
  name: string;
  count: number;
}

interface Keywords {
  [keyword: string]: Keyword;
}

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
  const pythonProcess = spawn("python3", ["/Users/kanepetra/PycharmProjects/qs_nlp/main.py", text]);

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

var submissionEndpoint = async (req: Request, res: Response) => {
  try {
    let courses = await getCourses(process.argv[process.argv.length - 1]);
    let assignments = await getAssignments(process.argv[process.argv.length - 1], courses);
    let submissions = await getSubmissions(process.argv[process.argv.length - 1], assignments);

    let keywords: Keywords = {};
    for (let submission of submissions) {
      if (submission.workflow_state == "submitted") {
        for (let attachment of submission.attachments) {
          if (attachment["content-type"] == "application/pdf") {
            let file_keywords = await analyzePdf(attachment.url);

            // Add keywords to the global keywords
            for (let keyword in file_keywords) {
              if (keywords[keyword]) {
                keywords[keyword].count += file_keywords[keyword].count;
              } else {
                keywords[keyword] = file_keywords[keyword];
              }
            }
          }
        }
      }
    }

    // Sort keywords by count
    let sortedKeywords: Keyword[] = [];
    for (let keyword in keywords) {
      sortedKeywords.push(keywords[keyword]);
    }

    sortedKeywords.sort((a, b) => b.count - a.count);

    res.send(sortedKeywords);
  } catch (e) {
    console.log(e);
  }
};

export { submissionEndpoint };

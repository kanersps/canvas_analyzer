import { analyzePdf } from "../lib/analyze_pdf";
import { getContentTypeHandler } from "../lib/content-types";
import { Keywords } from "../models/keyword";
import { Submission } from "./submissions";
import { spawn } from "child_process";
import { once } from "events";

var getKewyords = async (submissions: Submission[]): Promise<Keywords> => {
  let data: string[] = [];
  for (let submission of submissions) {
    if (submission.workflow_state == "submitted") {
      for (let attachment of submission.attachments) {
        var handler = getContentTypeHandler(attachment["content-type"]);

        if (handler) {
          let file_data = await handler(attachment);

          for (let data_in_file in file_data) {
            data.push(data_in_file);
          }
        }
      }
    }
  }

  const pythonProcess = spawn("python3", ["./python/keyword_analyze.py", ...data]);

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

  pythonProcess.stderr.on("data", (data: any) => {
    console.log(data.toString());
  });

  await once(pythonProcess, "close");

  console.log("DONE GETTING KEYWORDS FROM PYTHON!");
  console.log(keywords);

  return keywords;
};

var sortKeywords = (keywords: Keywords): Keywords => {
  let sorted_keywords: Keywords = {};
  let sorted_keywords_array: string[] = [];

  for (let keyword in keywords) {
    sorted_keywords_array.push(keyword);
  }

  sorted_keywords_array.sort((a, b) => {
    return keywords[b].count - keywords[a].count;
  });

  for (let keyword of sorted_keywords_array) {
    sorted_keywords[keyword] = keywords[keyword];
  }

  return sorted_keywords;
};

export { getKewyords, sortKeywords };

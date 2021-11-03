import { analyzePdf } from "../lib/analyze_pdf";
import { getContentTypeHandler } from "../lib/content-types";
import { Keywords } from "../models/keyword";
import { Submission } from "./submissions";

var getKewyords = async (submissions: Submission[]): Promise<Keywords> => {
  let keywords: Keywords = {};
  for (let submission of submissions) {
    if (submission.workflow_state == "submitted") {
      for (let attachment of submission.attachments) {
        var handler = getContentTypeHandler(attachment["content-type"]);

        if (handler) {
          let file_keywords = await handler(attachment);

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

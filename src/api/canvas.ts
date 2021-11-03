import { Request, Response } from "express";
import { getCourses } from "./course";
import { getAssignments, getSubmissions } from "./submissions";
import { analyzePdf } from "../lib/analyze_pdf";
import { Keyword, Keywords } from "../models/keyword";

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

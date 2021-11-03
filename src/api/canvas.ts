import { Request, Response } from "express";
import { getCourses } from "./course";
import { getAssignments, getSubmissions } from "./submissions";
import { analyzePdf } from "../lib/analyze_pdf";
import { Keyword, Keywords } from "../models/keyword";
import { getKewyords, sortKeywords } from "./keywords";

var submissionEndpoint = async (req: Request, res: Response) => {
  try {
    let courses = await getCourses(process.argv[process.argv.length - 1]);
    let assignments = await getAssignments(process.argv[process.argv.length - 1], courses);
    let submissions = await getSubmissions(process.argv[process.argv.length - 1], assignments);

    let keywords: Keywords = sortKeywords(await getKewyords(submissions));

    res.send(keywords);
  } catch (e) {
    console.log(e);
  }
};

export { submissionEndpoint };

import { Course } from "./course";
import fetch from "node-fetch";

interface Attachment {
  id: number;
  url: string;
  "content-type": string;
  filename: string;
}

class Submission {
  workflow_state: string = "unsubmitted";
  attachments: Attachment[] = [];
}

class Assignment {
  course_id: number = 0;
  id: number = 0;
}

interface SubmissionResponse {
  status: string;
}

var getSubmissionsByCourse = async (token: string, courses: Course[]): Promise<Submission[]> => {
  let submissions: Submission[] = [];

  for (let course of courses) {
    const response = await fetch(`https://fhict.instructure.com/api/v1/courses/${course.id}/students/submissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    let data = await response.json();

    let response_data = data as SubmissionResponse;

    if (response_data.status != "unauthorized") {
      const sub_data = data as Submission[];

      submissions.push(...sub_data);
    }
  }

  return submissions;
};

var getSubmissions = async (token: String, assignments: Assignment[]): Promise<Submission[]> => {
  let submissions: Submission[] = [];

  for (let assignment of assignments) {
    const response = await fetch(`https://fhict.instructure.com/api/v1/courses/${assignment.course_id}/assignments/${assignment.id}/submissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    let data = await response.json();

    let response_data = data as SubmissionResponse;

    if (response_data.status != "unauthorized") {
      const sub_data = data as Submission[];

      submissions.push(...sub_data);
    }
  }

  return submissions;
};

var getAssignments = async (token: String, courses: Course[]): Promise<Assignment[]> => {
  let assignments: Assignment[] = [];

  for (let course of courses) {
    const response = await fetch(`https://fhict.instructure.com/api/v1/courses/${course.id}/assignments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as Assignment[];

    assignments.push(...data);
  }

  return assignments;
};

export { getAssignments, getSubmissions, Submission, Attachment, getSubmissionsByCourse };

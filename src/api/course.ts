import fetch from "node-fetch";

class Course {
  id: number = 0;
  name: string = "";
}

var getCourses = async (token: string): Promise<Course[]> => {
  const response = await fetch("https://fhict.instructure.com/api/v1/courses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data as Course[];
};

export { getCourses, Course };

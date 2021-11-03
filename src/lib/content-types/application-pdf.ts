import { Attachment } from "../../api/submissions";
import { Keywords } from "../../models/keyword";
import { analyzePdf } from "../analyze_pdf";

var handlePdf = async (attachment: Attachment): Promise<Keywords> => {
  let keywords: Keywords = {};

  let file_keywords = await analyzePdf(attachment.url);

  // Add keywords to the global keywords
  for (let keyword in file_keywords) {
    if (keywords[keyword]) {
      keywords[keyword].count += file_keywords[keyword].count;
    } else {
      keywords[keyword] = file_keywords[keyword];
    }
  }

  return keywords;
};

export { handlePdf };

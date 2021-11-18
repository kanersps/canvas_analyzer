import { Attachment } from "../../api/submissions";
import { Keywords } from "../../models/keyword";
import { analyzePdf } from "../analyze_pdf";

var handlePdf = async (attachment: Attachment): Promise<String> => {
  let keywords: Keywords = {};

  let file_data = await analyzePdf(attachment.url);

  return file_data;
};

export { handlePdf };

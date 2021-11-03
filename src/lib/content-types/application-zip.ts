import { Attachment } from "../../api/submissions";
import { Keywords } from "../../models/keyword";

var handleZip = async (attachment: Attachment): Promise<Keywords> => {
  let keywords: Keywords = {};

  console.log(attachment);

  return keywords;
};

export { handleZip };

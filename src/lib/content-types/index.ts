import { Attachment } from "../../api/submissions";
import { Keywords } from "../../models/keyword";
import { handlePdf } from "./application-pdf";

interface ContentType {
  [application: string]: (data: any) => Promise<any>;
}

const ContentTypes: ContentType = {
  "application/pdf": handlePdf,
};

var getContentTypeHandler = (contentType: string): ((data: Attachment) => Promise<Keywords>) | null => {
  if (contentType in ContentTypes) {
    return ContentTypes[contentType];
  } else {
    return null;
  }
};

export { getContentTypeHandler };

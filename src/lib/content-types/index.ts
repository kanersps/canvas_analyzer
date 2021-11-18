import { Attachment } from "../../api/submissions";
import { Keywords } from "../../models/keyword";
import { handlePdf } from "./application-pdf";
import { handleZip } from "./application-zip";

interface ContentType {
  [application: string]: (data: any) => Promise<any>;
}

const ContentTypes: ContentType = {
  "application/pdf": handlePdf,
  "application/x-zip-compressed": handleZip,
};

var getContentTypeHandler = (contentType: string): ((data: Attachment) => Promise<String>) | null => {
  if (contentType in ContentTypes) {
    return ContentTypes[contentType];
  } else {
    console.log(`No handler for content type ${contentType}`);
    return null;
  }
};

export { getContentTypeHandler };

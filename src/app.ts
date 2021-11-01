import express from "express";
import { submissionEndpoint } from "./api/canvas";

const app = express();
const port = 3000;

app.get("/submissions", submissionEndpoint);

// Listen on port
app.listen(port, () => console.log(`Listening on port ${port}`));

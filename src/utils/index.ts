import { createReadStream, unlinkSync } from "fs";
import fetch from "node-fetch";

export function fileUpload(url: string, filePath: string, headers?: any) {
  const stream = createReadStream(filePath);

  return fetch(url, {
    method: "POST",
    body: stream,
    headers,
  }).finally(() => unlinkSync(filePath));
}

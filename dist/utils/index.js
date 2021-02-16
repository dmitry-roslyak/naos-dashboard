"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_fetch_1 = require("node-fetch");
function fileUpload(url, filePath, headers) {
    const stream = fs_1.createReadStream(filePath);
    return node_fetch_1.default(url, {
        method: "POST",
        body: stream,
        headers,
    }).finally(() => fs_1.unlinkSync(filePath));
}
exports.fileUpload = fileUpload;
//# sourceMappingURL=index.js.map
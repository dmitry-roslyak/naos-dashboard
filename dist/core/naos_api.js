"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request_1 = require("request");
function api_tokenVerify(token, req, res) {
    return new Promise((resolve, reject) => {
        request_1.get({
            url: process.env.NAOS_URL + "/api/user",
            formData: { token: token }
        }, function (error, httpResponse, body) {
            if (error || httpResponse.statusCode != 200) {
                res.cookie('api_token', null, { signed: true, sameSite: true });
                reject(error);
            }
            else {
                res.cookie('api_token', token, { expires: new Date(24 * 60 * 60 * 1000 + Date.now()), signed: true, sameSite: true });
                resolve();
            }
        });
    });
}
exports.api_tokenVerify = api_tokenVerify;
function statusCheck() {
    return new Promise((resolve, reject) => {
        request_1.head(process.env.NAOS_URL, function (error, httpResponse, body) {
            error && reject(error);
            httpResponse && resolve(httpResponse.statusCode);
        });
    });
}
exports.statusCheck = statusCheck;
function imageUpload(req) {
    return new Promise((resolve, reject) => {
        let formData = {
            image: {
                value: fs_1.createReadStream(req.file.path),
                options: {
                    filename: req.file.originalname
                }
            },
            api_token: req.signedCookies.api_token || process.env.NODE_ENV !== 'production' && process.env.NAOS_API_TOKEN
        };
        if (!formData.api_token)
            throw new Error("api_token is undefined");
        request_1.post({
            url: process.env.NAOS_URL + "/api/image_upload",
            formData: formData,
            preambleCRLF: true,
            postambleCRLF: true
        }, function (error, httpResponse, body) {
            fs_1.unlinkSync(req.file.path);
            if (error || httpResponse.statusCode != 200) {
                reject(error || body);
            }
            else {
                resolve(body);
            }
        });
    });
}
exports.imageUpload = imageUpload;
//# sourceMappingURL=naos_api.js.map
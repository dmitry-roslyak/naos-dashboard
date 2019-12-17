"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const req = require("request-promise");
const request = req.defaults({
    baseUrl: process.env.NAOS_URL,
    headers: {
        'Accept': "application/json"
    }
});
function api_tokenVerify(api_token, req, res) {
    return request.get({
        url: "/api/user",
        qs: { api_token }
    })
        .then(() => res.cookie('api_token', api_token, { expires: new Date(24 * 60 * 60 * 1000 + Date.now()), signed: true, sameSite: true }))
        .catch(() => res.cookie('api_token', "false", { signed: true, sameSite: true }));
}
exports.api_tokenVerify = api_tokenVerify;
function statusCheck() {
    return request.head({
        url: "/",
        resolveWithFullResponse: true
    })
        .then(httpResponse => Promise.resolve(httpResponse.statusCode))
        .catch(error => Promise.resolve(error.statusCode ? error.statusCode : 500));
}
exports.statusCheck = statusCheck;
function fileUpload(r, url) {
    let formData = {
        file: {
            value: fs_1.createReadStream(r.file.path),
            options: {
                filename: r.file.originalname
            }
        },
        api_token: r.signedCookies.api_token || process.env.NODE_ENV !== 'production' && process.env.NAOS_API_TOKEN
    };
    let pr = request.post({
        url: url ? url : "/api/image_upload",
        formData: formData
    });
    pr.catch(error => console.error(error)).finally(() => fs_1.unlinkSync(r.file.path));
    return pr;
}
exports.fileUpload = fileUpload;
//# sourceMappingURL=naos_api.js.map
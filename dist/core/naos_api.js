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
        .catch(() => res.cookie('api_token', "false", { signed: true, sameSite: true }))
        .then(() => res.cookie('api_token', api_token, { expires: new Date(24 * 60 * 60 * 1000 + Date.now()), signed: true, sameSite: true }));
}
exports.api_tokenVerify = api_tokenVerify;
function statusCheck() {
    return new Promise((resolve, reject) => {
        request.head("/", function (error, httpResponse, body) {
            error && reject(error);
            httpResponse && resolve(httpResponse.statusCode);
        });
    });
}
exports.statusCheck = statusCheck;
function imageUpload(r) {
    let formData = {
        image: {
            value: fs_1.createReadStream(r.file.path),
            options: {
                filename: r.file.originalname
            }
        },
        api_token: r.signedCookies.api_token || process.env.NODE_ENV !== 'production' && process.env.NAOS_API_TOKEN
    };
    return request.post({
        url: "/api/image_upload",
        formData: formData
    })
        .finally(() => fs_1.unlinkSync(r.file.path));
}
exports.imageUpload = imageUpload;
//# sourceMappingURL=naos_api.js.map
const fs = require("fs");
const request = require("request");

function api_tokenVerify(token, req, res) {
    return new Promise((resolve, reject) => {
        token = token || req.session.api_token || process.env.NAOS_API_TOKEN;
        request.get({
            url: process.env.NAOS_URL + "/api/user",
            formData: { token: token }
        }, function (error, httpResponse, body) {
            if (error || httpResponse.statusCode != 200) {
                req.session.auth = false;
                reject(error);
            } else {
                req.session.auth = true;
                req.session.api_token = token;
                resolve();
            }
        });
    });
}
function imageUpload(file) {
    return new Promise((resolve, reject) => {
        var formData = {
            image: {
                value: fs.createReadStream(file.path),
                options: {
                    filename: file.originalFilename
                }
            },
            api_token: process.env.NAOS_API_TOKEN
        };
        request.post({
            url: process.env.NAOS_URL + "/api/image_upload",
            formData: formData,
            preambleCRLF: true,
            postambleCRLF: true
        }, function (error, httpResponse, body) {
            if (error || httpResponse.statusCode != 200) {
                reject(error || body)
            } else {
                resolve(body);
            }
        }
        );
    });

}
module.exports = { imageUpload, api_tokenVerify };
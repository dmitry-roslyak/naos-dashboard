const fs = require("fs");
const request = require("request");

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
module.exports = imageUpload;
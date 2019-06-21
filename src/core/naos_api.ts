import { Response } from "express"
import { createReadStream, unlinkSync } from "fs"
import { get, post } from "request";

function api_tokenVerify(token: string, req: any, res: Response) {
    return new Promise((resolve, reject) => {
        token = token || req.session.api_token || process.env.NAOS_API_TOKEN;
        get({
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
function imageUpload(req: any) {
    return new Promise((resolve, reject) => {
        let formData = {
            image: {
                value: createReadStream(req.file.path),
                options: {
                    filename: req.file.originalname
                }
            },
            api_token: req.session.api_token
        };
        post({
            url: process.env.NAOS_URL + "/api/image_upload",
            formData: formData,
            preambleCRLF: true,
            postambleCRLF: true
        }, function (error, httpResponse, body) {
            unlinkSync(req.file.path);
            if (error || httpResponse.statusCode != 200) {
                reject(error || body)
            } else {
                resolve(body);
            }
        }
        );
    });

}

export { imageUpload, api_tokenVerify }
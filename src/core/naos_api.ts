import { Response, Request } from "express"
import { createReadStream, unlinkSync } from "fs"
import { get, post } from "request";

function api_tokenVerify(token: string, req: Request, res: Response) {
    return new Promise((resolve, reject) => {
        get({
            url: process.env.NAOS_URL + "/api/user",
            formData: { token: token }
        }, function (error, httpResponse, body) {
            if (error || httpResponse.statusCode != 200) {
                res.cookie('api_token', null, { signed: true, sameSite: true })
                reject(error);
            } else {
                res.cookie('api_token', token, { expires: new Date(24 * 60 * 60 * 1000 + Date.now()), signed: true, sameSite: true })
                resolve();
            }
        });
    });
}
function imageUpload(req: Request) {
    return new Promise((resolve, reject) => {
        let formData = {
            image: {
                value: createReadStream(req.file.path),
                options: {
                    filename: req.file.originalname
                }
            },
            api_token: req.signedCookies.api_token
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
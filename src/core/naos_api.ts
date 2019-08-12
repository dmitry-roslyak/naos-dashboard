import { Response, Request } from "express"
import { createReadStream, unlinkSync } from "fs"
import * as req from "request-promise";

const request = req.defaults({
    baseUrl: process.env.NAOS_URL,
    headers: {
        'Accept': "application/json"
    }
})

function api_tokenVerify(api_token: string, req: Request, res: Response) {
    return request.get({
        url: "/api/user",
        qs: { api_token }
    })
        .then(() => res.cookie('api_token', api_token, { expires: new Date(24 * 60 * 60 * 1000 + Date.now()), signed: true, sameSite: true }))
        .catch(() => res.cookie('api_token', "false", { signed: true, sameSite: true }))

}
function statusCheck() {
    return new Promise((resolve, reject) => {
        request.head("/", function (error, httpResponse, body) {
            error && reject(error)
            httpResponse && resolve(httpResponse.statusCode)
        })
    })
}
function imageUpload(r: Request) {
    let formData = {
        image: {
            value: createReadStream(r.file.path),
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
        .finally(() => unlinkSync(r.file.path))
}

export { imageUpload, api_tokenVerify, statusCheck }
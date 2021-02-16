"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WebPushService_1 = require("../services/WebPushService");
var path = require("path");
const router = express_1.Router();
exports.webpushRouter = router;
router.get("/vue", (req, res) => {
    const vueDir = path.join(__dirname, "../../online-store-dashboard/dist/");
    // console.log(vueDir);
    res.sendFile(vueDir + "vue.html");
});
router.post("/webpush/subscribe", function (req, res, next) {
    let body = req.body;
    if (body.identificator.key != "email" || !body.identificator.value) {
        res.status(400).send("identificator is unknown");
        return;
    }
    const expirationTime = body.subscription.expirationTime
        ? new Date(body.subscription.expirationTime)
        : new Date(+new Date() + 31536000000);
    if (+expirationTime - +new Date() < 0) {
        res.status(400).send("Subscription expired");
    }
    WebPushService_1.WebPushService.subscribe(body.identificator, {
        endpoint: body.subscription.endpoint,
        keys: body.subscription.keys,
        expirationTime,
    })
        .then(() => res.send("subscribe OK"))
        .catch((error) => {
        console.error(error.message);
        if (error.message == "PushSubscription: User is not authorized")
            res.status(401).send(error.message);
        else
            res.status(500).send("subscription failed");
    });
});
router.post("/webpush/broadcast", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { product_id } = req.body;
        const discountForProduct = yield WebPushService_1.WebPushService.discountForProduct(product_id, {
            url: "https://example.org",
            currency: "₴",
        });
        WebPushService_1.WebPushService.getInstance()
            .broadcast(discountForProduct.usersIDs, discountForProduct.webPushPayloadArray)
            .then(() => res.send("broadcast OK"));
    });
});
router.get("/webpush/generate-vapid-keys", function (req, res, next) {
    WebPushService_1.WebPushService.generateVAPIDKeys();
    res.send(JSON.stringify(WebPushService_1.WebPushService));
});
exports.default = router;
//# sourceMappingURL=webpush.js.map
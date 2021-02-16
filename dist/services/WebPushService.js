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
const web_push_1 = require("web-push");
const models_1 = require("../models");
const l10n_1 = require("../services/l10n");
class WebPushService {
    constructor(subject, privateKey, publicKey) {
        this.subject = subject;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    static getInstance(subject, privateKey, publicKey) {
        if (this._webPushService)
            return this._webPushService;
        else
            return (this._webPushService = new WebPushService(subject, privateKey, publicKey));
    }
    sendNotification(pushSubscription, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const pushOptions = {
                vapidDetails: {
                    subject: this.subject,
                    privateKey: this.privateKey,
                    publicKey: this.publicKey,
                },
                // TTL: payload.ttl,
                headers: {},
            };
            return web_push_1.sendNotification(pushSubscription, payload, pushOptions);
        });
    }
    static subscribe(identificator, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.User.findOne({
                where: {
                    [identificator.key]: identificator.value,
                },
                include: [models_1.UserPushSubscription],
                order: [[models_1.UserPushSubscription, "expirationTime", "DESC"]],
            }).then((user) => __awaiter(this, void 0, void 0, function* () {
                function userPushSubscriptionCreate() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return models_1.UserPushSubscription.create({
                            user_id: user.id,
                            endpoint: subscription.endpoint,
                            expirationTime: subscription.expirationTime,
                            keys: JSON.stringify(subscription.keys),
                        });
                    });
                }
                if (!user) {
                    throw new Error("PushSubscription: User is not authorized");
                }
                else if (!user.UserPushSubscriptions) {
                    return userPushSubscriptionCreate();
                }
                else if (user.UserPushSubscriptions.length > 9) {
                    return user.UserPushSubscriptions[user.UserPushSubscriptions.length - 1].update({
                        endpoint: subscription.endpoint,
                        expirationTime: subscription.expirationTime,
                        keys: JSON.stringify(subscription.keys),
                    });
                }
                else {
                    let pushSubscription = user.UserPushSubscriptions.find((userPushSubscription) => userPushSubscription.endpoint === subscription.endpoint);
                    if (pushSubscription) {
                        return pushSubscription.update({
                            endpoint: subscription.endpoint,
                            expirationTime: subscription.expirationTime,
                            keys: JSON.stringify(subscription.keys),
                        });
                    }
                    else {
                        return userPushSubscriptionCreate();
                    }
                }
            }));
        });
    }
    static discountForProduct(product_id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.UserWishes.findAll({
                where: {
                    product_id,
                },
                attributes: ["user_id", "price"],
                include: [models_1.User, models_1.Product],
            }).then((userWishes) => __awaiter(this, void 0, void 0, function* () {
                const usersIDs = [];
                const webPushPayloadArray = [];
                for (let i = 0; i < userWishes.length; i++) {
                    // console.log(userWishes[i]);
                    const priceDiff = userWishes[i].Product.price - userWishes[i].price;
                    if (priceDiff >= 0) {
                        console.log("Price must be greater than 0 and negative, 0 > ", priceDiff);
                        return;
                    }
                    const title = yield l10n_1.LocalizationService.localize(userWishes[i].User.language, l10n_1.LocalizationTemplateKey.webPushNotificationDiscountTitle, [
                        {
                            key: "priceDiff",
                            value: priceDiff.toString(),
                        },
                        {
                            key: "priceTotal",
                            value: userWishes[i].price.toString(),
                        },
                        {
                            key: "currency",
                            value: params.currency,
                        },
                    ]);
                    usersIDs.push(userWishes[i].user_id);
                    webPushPayloadArray.push({
                        title,
                        body: "",
                        icon: userWishes[i].Product.img_src,
                        data: { url: params.url },
                    });
                }
                return {
                    usersIDs,
                    webPushPayloadArray,
                };
            }));
        });
    }
    broadcast(usersIDs, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.UserPushSubscription.findAll({ where: { user_id: usersIDs } }).then((userPushSubscriptions) => {
                // console.log("subscriptions: ", userPushSubscriptions);
                for (let i = 0; i < userPushSubscriptions.length; i++) {
                    this.sendNotification({
                        endpoint: userPushSubscriptions[i].endpoint,
                        keys: payload instanceof Array ? JSON.parse(userPushSubscriptions[i].keys) : payload,
                    }, JSON.stringify(payload[i])).catch((error) => console.error(error));
                }
            });
        });
    }
    // VAPID keys should only be generated only once.
    static generateVAPIDKeys() {
        return web_push_1.generateVAPIDKeys();
    }
}
exports.WebPushService = WebPushService;
//# sourceMappingURL=WebPushService.js.map
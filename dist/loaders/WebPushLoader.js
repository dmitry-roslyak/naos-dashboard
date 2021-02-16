"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebPushService_1 = require("../services/WebPushService");
const keys = require("../../webPushKeys.json");
process.env.webpush_public_key = keys.publicKey;
process.env.webpush_private_key = keys.privateKey;
WebPushService_1.WebPushService.getInstance("http://example.com", process.env.webpush_private_key, process.env.webpush_public_key);
//# sourceMappingURL=WebPushLoader.js.map
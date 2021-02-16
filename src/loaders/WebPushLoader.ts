import { WebPushService } from "../services/WebPushService";

const keys = require("../../webPushKeys.json");

process.env.webpush_public_key = keys.publicKey;
process.env.webpush_private_key = keys.privateKey;

WebPushService.getInstance("http://example.com", process.env.webpush_private_key, process.env.webpush_public_key);

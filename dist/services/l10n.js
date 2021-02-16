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
const models_1 = require("../models");
var LocalizationKey;
(function (LocalizationKey) {
})(LocalizationKey || (LocalizationKey = {}));
var LocalizationTemplateKey;
(function (LocalizationTemplateKey) {
    LocalizationTemplateKey["webPushNotificationDiscountTitle"] = "webPushNotificationDiscountTitle";
})(LocalizationTemplateKey = exports.LocalizationTemplateKey || (exports.LocalizationTemplateKey = {}));
class LocalizationService {
    static localize(locale, key, replace) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Langs.findOne({
                where: {
                    locale,
                    key,
                },
                raw: true,
            }).then((row) => {
                if (replace && Object.keys(LocalizationTemplateKey).includes(key)) {
                    return LocalizationService.interpolate(row.text, replace);
                }
                else {
                    return row.text;
                }
            });
        });
    }
    static interpolate(templateString, replace) {
        replace.forEach((r) => {
            templateString = templateString.replace("${" + r.key + "}", r.value);
        });
        return templateString;
    }
}
exports.LocalizationService = LocalizationService;
//# sourceMappingURL=l10n.js.map
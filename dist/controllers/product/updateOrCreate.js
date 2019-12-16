"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../core/models");
const naos_api_1 = require("../../core/naos_api");
exports.updateOrCreate = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let fields = req.body;
        let error;
        let imageName = req.file && (yield naos_api_1.imageUpload(req).catch(err => error = err));
        if (error) {
            res.status(400).send(error.message);
            return;
        }
        Object.keys(fields).forEach(name => name == "specs" || Array.isArray(fields[name]) && (fields[name] = fields[name][0]));
        if (imageName)
            fields.img_src = imageName;
        fields.Specs = Object.values(fields.specs);
        fields.Specs = fields.Specs.filter((element) => element.value.length > 0);
        models_1.Product.createOrUpdateWithSpecs(fields).then((result) => {
            setTimeout(() => {
                if (fields.id) {
                    console.log(`Product (id: ${fields.id}) updated`);
                    res.redirect(".");
                }
                else {
                    console.log(`Product created`);
                    res.redirect("/product/" + result[0].id);
                }
            }, 50);
        }).catch(err => {
            console.error(err);
            res.status(400).send(err.message);
        });
    });
};
//# sourceMappingURL=updateOrCreate.js.map
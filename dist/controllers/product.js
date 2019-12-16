"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const find_1 = require("./product/find");
const updateOrCreate_1 = require("./product/updateOrCreate");
const showOne_1 = require("./product/showOne");
const create = function (req, res, next) {
    let product = models_1.Product.build({
        rating: 0,
        vote_count: 0,
        is_visible: true,
    });
    showOne_1.showOne(req, res, next, product);
};
exports.default = { create, showOne: showOne_1.showOne, updateOrCreate: updateOrCreate_1.updateOrCreate, find: find_1.find };
//# sourceMappingURL=product.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../core/models");
const sequelize_1 = require("sequelize");
exports.find = function (req, res) {
    let input = req.body.input || res.locals.formInput || req.params.input || "";
    let options;
    if (input) {
        options = {
            where: {
                name: {
                    [sequelize_1.Op.like]: `%${input}%`
                }
            }
        };
    }
    else {
        options = {};
    }
    models_1.Product.findAll(Object.assign(Object.assign({}, options), { offset: res.locals.offset || null, limit: res.locals.limit || 30 })).then(products => {
        models_1.Product.count(options).then(total => {
            res.locals.formInput = input;
            res.locals.products = products;
            res.locals.total = total;
            res.render("products", { title: "Products" });
        });
    });
};
//# sourceMappingURL=find.js.map
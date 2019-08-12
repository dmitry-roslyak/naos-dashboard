"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const controller = {
    show: function (req, res, next) {
        models_1.Discount.findAll().then(discounts => {
            res.render("discounts", { discounts: discounts, title: "Discounts" });
        });
    },
    showOne: function (req, res, next) {
        models_1.Discount.findByPk(req.params.id).then(discount => {
            res.render("discount", { discount: discount, title: "Discount" });
        });
    },
    create: function (req, res, next) {
        models_1.Discount.create(req.body);
        res.redirect("/discounts");
    },
    edit: function (req, res, next) {
        models_1.Discount.update(req.body, { where: { id: req.params.id } });
        res.redirect("/discounts");
    }
};
exports.discountController = controller;
exports.default = controller;
//# sourceMappingURL=discount.js.map
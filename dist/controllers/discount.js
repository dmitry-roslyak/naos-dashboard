"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const show = function (req, res) {
    models_1.Discount.findAll().then((discounts) => {
        res.render("discounts", { discounts: discounts, title: "Discounts" });
    });
};
const showOne = function (req, res) {
    models_1.Discount.findByPk(req.params.id).then((discount) => {
        res.render("discount", { discount: discount, title: "Discount" });
    });
};
const create = function (req, res) {
    models_1.Discount.create(req.body);
    res.redirect("/discounts");
};
const edit = function (req, res) {
    models_1.Discount.update(req.body, { where: { id: req.params.id } });
    res.redirect("/discounts");
};
exports.default = { show, showOne, create, edit };
//# sourceMappingURL=discount.js.map
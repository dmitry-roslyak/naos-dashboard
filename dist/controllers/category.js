"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const show = function (req, res) {
    models_1.Category.findAll().then(categories => {
        res.render("categories", { categories: categories, title: "Categories" });
    });
};
const createCategory = function (req, res) {
    models_1.Category.create(req.body);
    res.redirect("/categories");
};
const showOne = function (req, res) {
    models_1.Category.findByPk(req.params.id).then(category => {
        res.render("category", { category, title: "Category" });
    });
};
exports.default = { show, createCategory, showOne };
//# sourceMappingURL=category.js.map
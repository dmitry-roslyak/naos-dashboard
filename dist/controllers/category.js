"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const controller = {
    show: function (req, res) {
        models_1.Category.findAll().then(categories => {
            res.render("categories", { categories: categories, title: "Categories" });
        });
    },
    createCategory: function (req, res) {
        models_1.Category.create(req.body);
        res.redirect("/categories");
    },
    showOne: function (req, res) {
        models_1.Category.findByPk(req.params.id).then(category => {
            res.render("category", { category, title: "Category" });
        });
    },
};
exports.categoriesController = controller;
exports.default = controller;
//# sourceMappingURL=category.js.map
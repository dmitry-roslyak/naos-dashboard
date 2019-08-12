"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const controller = {
    showCategories: function (req, res) {
        models_1.Category.findAll().then(categories => {
            res.render("categories", { categories: categories, title: "Categories" });
        });
    },
    createCategory: function (req, res) {
        models_1.Category.create(req.body);
        res.redirect("/categories");
    }
};
exports.categoriesController = controller;
exports.default = controller;
//# sourceMappingURL=category.js.map
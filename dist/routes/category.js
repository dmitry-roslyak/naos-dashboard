"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = express_1.Router();
exports.categoryRouter = router;
router.get("/categories", function (req, res) {
    models_1.Category.findAll().then((categories) => {
        res.render("categories", { categories: categories, title: "Categories", authentication: true });
    });
});
router.get("/category/:id", function (req, res) {
    models_1.Category.findByPk(req.params.id).then((category) => {
        res.render("category", { category, title: "Category" });
    });
});
router.post("/categoryCreate", function (req, res) {
    models_1.Category.create(req.body);
    res.redirect("/categories");
});
exports.default = router;
//# sourceMappingURL=category.js.map
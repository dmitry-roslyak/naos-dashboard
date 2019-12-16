import { Category } from "../core/models";
import { RequestHandler } from "express-serve-static-core";

const show: RequestHandler = function (req, res) {
    Category.findAll().then(categories => {
        res.render("categories", { categories: categories, title: "Categories" });
    });
}
const createCategory: RequestHandler = function (req, res) {
    Category.create(req.body);
    res.redirect("/categories");
}
const showOne: RequestHandler = function (req, res) {
    Category.findByPk(req.params.id).then(category => {
        res.render("category", { category, title: "Category" });
    });
}

export default { show, createCategory, showOne }
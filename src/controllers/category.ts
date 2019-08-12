import { RequestHandler } from "express";
import { Category } from "../core/models";

interface Controller {
    [property: string]: RequestHandler
}

const controller: Controller = {
    show: function (req, res) {
        Category.findAll().then(categories => {
            res.render("categories", { categories: categories, title: "Categories" });
        });
    },
    createCategory: function (req, res) {
        Category.create(req.body);
        res.redirect("/categories");
    },
    showOne: function (req, res) {
        Category.findByPk(req.params.id).then(category => {
            res.render("category", { category, title: "Category" });
        });
    },
};

export { controller as categoriesController }
export default controller
import { RequestHandler } from "express";
import { Category } from "../core/models";

interface Controller {
    [property: string]: RequestHandler
}

const controller: Controller = {
    showCategories: function (req, res) {
        Category.findAll().then(categories => {
            res.render("categories", { categories: categories, title: "Categories" });
        });
    },
    createCategory: function (req, res) {
        Category.create(req.body);
        res.redirect("/categories");
    }
};

export { controller as categoriesController }
export default controller
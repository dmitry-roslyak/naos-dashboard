import { NextFunction, Response, Request } from "express";
import { Category } from "../core/models";

module.exports = {
    showCategories: function (req: Request, res: Response, next: NextFunction) {
        Category.findAll().then(categories => {
            res.render("categories", { categories: categories });
        });
    },
    createCategory: function (req: Request, res: Response, next: NextFunction) {
        Category.create(req.body);
        res.redirect("/categories");
    }
};

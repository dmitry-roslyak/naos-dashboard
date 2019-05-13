const Discount = require("../core/models").Discount;
const Category = require("../core/models").Category;

module.exports = {
    showDiscounts: function (req, res, next) {
        Discount.findAll().then(discounts => {
            res.render("discounts", { discounts: discounts });
        });
    },
    showCategories: function (req, res, next) {
        Category.findAll().then(categories => {
            res.render("categories", { categories: categories });
        });
    },
    createCategory: function (req, res, next) {
        Category.create(req.body);
        res.redirect("/categories");
    }
};

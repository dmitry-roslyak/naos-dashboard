const Category = require("../core/models").Category;

module.exports = {
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

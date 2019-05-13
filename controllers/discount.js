const Discount = require("../core/models").Discount;

module.exports = {
    show: function (req, res, next) {
        Discount.findAll().then(discounts => {
            res.render("discounts", { discounts: discounts });
        });
    },
    showOne: function (req, res, next) {
        Discount.findByPk(req.params.id).then(discount => {
            res.render("discount", { discount: discount });
        });
    },
    create: function (req, res, next) {
        Discount.create(req.body);
        res.redirect("/discounts");
    },
    edit: function (req, res, next) {
        Discount.update(req.body, { where: { id: req.params.id } });
        res.redirect("/discounts");
    }
};

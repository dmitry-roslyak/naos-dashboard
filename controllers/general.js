const Discount = require("../core/models").Discount;

module.exports = {
    discountAll: function (req, res, next) {
        Discount.findAll().then(discounts => {
            res.render("discounts", { discounts: discounts });
        });
    }
};

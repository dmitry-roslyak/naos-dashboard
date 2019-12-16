"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../core/models");
const sequelize_1 = require("sequelize");
const _ = require("lodash");
exports.showOne = function (req, res, next, product = null) {
    let p0 = [];
    p0.push(product || models_1.Product.findByPk(req.params.id, {
        include: [models_1.Discount, models_1.Spec]
    }));
    p0.push(models_1.Discount.findAll());
    p0.push(models_1.Category.findAll());
    p0.push(models_1.Spec.findAll({
        attributes: [[sequelize_1.Sequelize.fn('DISTINCT', sequelize_1.Sequelize.col('name')), 'name'], 'value', 'val_type'],
        raw: true
    }));
    Promise.all(p0).then(([product, discounts, categories, specs]) => {
        let spec_values = _.groupBy(specs, object => object.name);
        let s2 = _.uniqBy(specs, (object) => object.name);
        // console.log(product)
        res.render("product", {
            product: product,
            discounts: discounts,
            categories: categories,
            specs: s2,
            spec_values: spec_values,
            title: "Product"
        });
    });
};
//# sourceMappingURL=showOne.js.map
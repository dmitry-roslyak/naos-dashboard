"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../loaders/sequelize");
const models_1 = require("../models");
class ProductService {
    static search(input, offset, limit) {
        let options;
        if (input) {
            options = {
                where: {
                    name: {
                        [sequelize_1.Op.iLike]: `%${input}%`,
                    },
                },
            };
        }
        else {
            options = {
            // raw: true,
            };
        }
        return Promise.all([
            models_1.Product.findAll(Object.assign(Object.assign({}, options), { offset,
                limit, include: [models_1.ProductHistory, models_1.Link], order: [
                    ["id", "ASC"],
                    [models_1.ProductHistory, "date", "DESC"],
                ] })),
            models_1.Product.count(options),
        ]);
    }
    static showOne(id) {
        let p0 = [];
        p0.push(models_1.Product.findByPk(id, {
            include: [models_1.Discount, models_1.Spec, models_1.Link],
        }));
        p0.push(models_1.Discount.findAll());
        p0.push(models_1.Category.findAll());
        p0.push(models_1.Spec.findAll({
            attributes: [[sequelize_1.Sequelize.fn("DISTINCT", sequelize_1.Sequelize.col("name")), "name"], "value", "val_type"],
            raw: true,
        }));
        return Promise.all(p0).then(([product, discounts, categories, specs]) => {
            const spec_values = _.groupBy(specs, (object) => object.name);
            const s2 = _.uniqBy(specs, (object) => object.name);
            return {
                product,
                discounts,
                categories,
                specs: s2,
                spec_values: spec_values,
                title: "Product",
            };
        });
    }
    static create(fields) {
        return models_1.Product.create(fields, {
            include: [models_1.Link],
        });
    }
    static update(fields) {
        return Promise.all([
            fields.id &&
                models_1.Product.findByPk(fields.id).then((product) => {
                    return product.update(fields);
                }),
            fields.Links && this.updateLink(fields.content_ids, fields.Links),
        ]);
    }
    static updateLink(content_ids, links) {
        return sequelize_2.sequelize.transaction((t) => {
            return Promise.all([
                models_1.Link.destroy({
                    where: {
                        content_ids: content_ids,
                    },
                }),
                models_1.Link.bulkCreate(links),
            ]);
        });
    }
    static deleteLink(linkId) {
        return models_1.Link.destroy({
            where: {
                id: linkId,
            },
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map
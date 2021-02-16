"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const sequelize_1 = require("sequelize");
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
                limit, include: [models_1.ProductHistory], order: [
                    ["id", "ASC"],
                    [models_1.ProductHistory, "date", "DESC"],
                ] })),
            models_1.Product.count(options),
        ]);
    }
    //update create, then remove
    static createV1old() {
        return models_1.Product.build({
            name: "Test",
            price: 101.93,
            rating: 0,
            vote_count: 0,
            is_visible: true,
            available: 10,
        });
    }
    static showOne(id) {
        let p0 = [];
        p0.push(models_1.Product.findByPk(id, {
            include: [models_1.Discount, models_1.Spec],
            raw: true,
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
    static updateOrCreate(fields, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.keys(fields).forEach((name) => name == "specs" || (Array.isArray(fields[name]) && (fields[name] = fields[name][0])));
            fields.Specs = Object.values(fields.specs);
            fields.Specs = fields.Specs.filter((element) => element.value.length > 0);
            fields.img_src = (yield fileName) || "";
            return models_1.Product.createOrUpdateWithSpecs(fields);
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map
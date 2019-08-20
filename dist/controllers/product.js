"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../core/models");
const sequelize_1 = require("sequelize");
const naos_api_1 = require("../core/naos_api");
const _ = require("lodash");
const controller = {
    create: function (req, res, next) {
        let product = models_1.Product.build({
            rating: 0,
            vote_count: 0,
            is_visible: true,
        });
        controller.showOne(req, res, next, product);
    },
    showOne: function (req, res, next, product = null) {
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
    },
    updateOrCreate: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let fields = req.body;
            let error;
            let imageName = req.file && (yield naos_api_1.imageUpload(req).catch(err => error = err));
            if (error) {
                res.status(400).send(error.message);
                return;
            }
            Object.keys(fields).forEach(name => name == "specs" || Array.isArray(fields[name]) && (fields[name] = fields[name][0]));
            if (imageName)
                fields.img_src = imageName;
            fields.Specs = Object.values(fields.specs);
            fields.Specs = fields.Specs.filter((element) => element.value.length > 0);
            models_1.Product.createOrUpdateWithSpecs(fields).then((result) => {
                setTimeout(() => {
                    if (fields.id) {
                        console.log(`Product (id: ${fields.id}) updated`);
                        res.redirect(".");
                    }
                    else {
                        console.log(`Product created`);
                        res.redirect("/product/" + result[0].id);
                    }
                }, 50);
            }).catch(err => {
                console.error(err);
                res.status(400).send(err.message);
            });
        });
    },
    find: function (req, res, next) {
        let input = req.body.input || res.locals.formInput || req.params.input || "";
        let options;
        if (input) {
            options = {
                where: {
                    name: {
                        [sequelize_1.Op.like]: `%${input}%`
                    }
                }
            };
        }
        else {
            options = {};
        }
        models_1.Product.findAll(Object.assign({}, options, { offset: res.locals.offset || null, limit: res.locals.limit || 30 })).then(products => {
            models_1.Product.count(options).then(total => {
                res.locals.formInput = input;
                res.locals.products = products;
                res.locals.total = total;
                res.render("products", { title: "Products" });
            });
        });
    }
};
exports.productController = controller;
exports.default = controller;
//# sourceMappingURL=product.js.map
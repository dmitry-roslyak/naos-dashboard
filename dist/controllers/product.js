"use strict";
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
        let fields = req.body;
        let imageUploadPromise = req.file && naos_api_1.imageUpload(req);
        Object.keys(fields).forEach(name => name == "specs" || Array.isArray(fields[name]) && (fields[name] = fields[name][0]));
        fields.Specs = Object.values(fields.specs);
        fields.Specs = fields.Specs.filter((element) => element.value.length > 0);
        // console.log(fields)
        if (imageUploadPromise) {
            imageUploadPromise.then(function (fileName) {
                fields.img_src = fileName;
                console.log(fileName);
                updateOrCreate();
            }).catch(function (error) {
                res.status(500).send(error.message);
            });
        }
        else
            updateOrCreate();
        function updateOrCreate() {
            models_1.Product.createOrUpdateWithSpecs(fields).then((result) => {
                // console.log(result)
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
        }
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
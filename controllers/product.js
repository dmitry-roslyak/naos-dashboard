const Product = require("../core/models").Product;
// const Spec = require("../core/models").Spec;
const Discount = require("../core/models").Discount;
const Category = require("../core/models").Category;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const multiparty = require("multiparty");
const imageUpload = require("../core/naos_api");

Product.belongsTo(Discount);
// Product.hasMany(Spec, { foreignKey: "prod_id", primaryKey: "id" });

const Controller = {
    create: function (req, res, next) {
        Controller.showOne(req, res, next, {
            rating: 0,
            vote_count: 0,
            is_visible: true,
        });
    },
    showOne: function (req, res, next, product = null) {
        let p0 = [];
        p0.push(product || Product.findByPk(req.params.id, {
            include: [Discount]
        }));
        p0.push(Discount.findAll());
        p0.push(Category.findAll());
        // p0.push(Spec.findAll({
        //     attributes: ['name'],
        //     group: ['name'],
        //     raw: true
        // }));
        Promise.all(p0).then(([product, discounts, categories]) => {
            // let p1 = [];
            // results[3].forEach(function (n) {
            //     p1.push(Spec.findAll({
            //         where: { name: n.name },
            //         // attributes: [[Sequelize.literal('DISTINCT `value`'), 'value']],
            //         attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('value')), 'value'], 'val_type'],
            //         raw: true
            //     }))
            // });
            // Promise.all(p1).then(function (params) {
            //     let spec_values = {};
            //     results[3].forEach(function (n, i) {
            //         spec_values[n.name] = params[i];
            //     })
            res.render("product", {
                product: product,
                discounts: discounts,
                categories: categories,
                // spec_names: results[3],
                // spec_values: spec_values
            });
            // })
        });
    },
    updateOrCreate: function (req, res, next) {
        var form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            let imageUploadPromise;
            Object.keys(files).forEach(function (name) {
                files[name].forEach(function (file) {
                    imageUploadPromise = file.size && imageUpload(file);
                });
            });
            if (err) {
                console.error(err);
                return;
            }
            Object.keys(fields).forEach(name => fields[name] = fields[name][0]);
            if (imageUploadPromise) {
                imageUploadPromise.then(function (fileName) {
                    fields.img_src = fileName;
                    console.log(fileName);
                    updateOrCreate();
                }).catch(function (error) {
                    console.error(error);
                })
            } else updateOrCreate();
            function updateOrCreate() {
                let product = fields.id ? Product.update(fields, { where: { id: fields.id } }) : Product.create(fields);
                product.then(function (product) {
                    if (fields.id) {
                        console.log(`Product (id: ${fields.id}) updated`);
                        res.redirect(".");
                    } else {
                        console.log(`Product created`);
                        res.redirect("/product/" + product.id);
                    }
                })
            }
        });
    },
    find: function (req, res, next) {
        let input =
            req.body.input || res.locals.formInput || req.params.input || "";
        let options;
        if (input) {
            options = {
                where: {
                    name: {
                        [Op.like]: `%${input}%`
                    }
                }
            };
        } else {
            options = {};
        }
        Product.findAll({
            ...options,
            offset: res.locals.offset || null,
            limit: res.locals.limit || 30
        }).then(products => {
            Product.count(options).then(total => {
                res.locals.formInput = input;
                res.locals.products = products;
                res.locals.total = total;
                res.render("products");
            });
        });
    }
};

module.exports = Controller;

const Product = require("../core/models").Product;
const Discount = require("../core/models").Discount;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const multiparty = require("multiparty");
const imageUpload = require("../core/naos_api");

// Product.hasOne(Discount, { foreignKey: "id", primaryKey: "discount_id" });
Product.belongsTo(Discount);

module.exports = {
    discountAll: function (req, res, next) {
        Discount.findAll().then(discounts => {
            res.render("discounts", { discounts: discounts });
        });
    },
    findById: function (req, res, next) {
        Product.findAll({
            where: {
                id: req.params.id
            },
            include: [Discount]
        }).then(product => {
            Discount.findAll().then(discounts => {
                res.render("product", { product: product[0], discounts: discounts });
            });
        });
    },
    edit: function (req, res, next) {
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
                    update();
                }).catch(function (error) {
                    console.error(error);
                })
            } else update();
            function update() {
                Product.findByPk(fields.id).then(product => {
                    product.update(fields).then(function () {
                        console.log(`Product (id: ${fields.id}) updated`);
                        res.redirect(".");
                    })
                });
            }
        });
    },
    paginator: function (req, res, next) {
        res.locals.offset = +req.params.offset || null;
        res.locals.limit = +req.params.limit || 30;
        next();
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

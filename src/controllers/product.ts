import { NextFunction, Response, Request } from "express";
import { Product, Discount, Spec, Category } from "../core/models";
import { Op, Sequelize } from "sequelize";
import { imageUpload } from "../core/naos_api";
import * as _ from "lodash";

Product.belongsTo(Discount);
Product.hasMany(Spec, { foreignKey: "prod_id" });

const controller = {
    create: function (req: Request, res: Response, next: NextFunction) {
        let product = Product.build({
            rating: 0,
            vote_count: 0,
            is_visible: true,
        });
        controller.showOne(req, res, next, product);
    },
    showOne: function (req: Request, res: Response, next: NextFunction, product: Product = null) {
        let p0: Array<Promise<any> | Product> = [];
        p0.push(product || Product.findByPk(req.params.id, {
            include: [Discount, Spec]
        }));
        p0.push(Discount.findAll());
        p0.push(Category.findAll());
        p0.push(Spec.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('name')), 'name'], 'value', 'val_type'],
            raw: true
        }));

        Promise.all(p0).then(([product, discounts, categories, specs]) => {
            let s: any = _.groupBy(specs, object => object.name)

            res.render("product", {
                product: product,
                discounts: discounts,
                categories: categories,
                spec_names: Object.keys(s),
                spec_values: s
            });
        });
    },
    updateOrCreate: function (req: Request, res: Response, next: NextFunction) {
        let fields = req.body;
        let imageUploadPromise = req.file && imageUpload(req)

        Object.keys(fields).forEach(name => Array.isArray(fields[name]) && (fields[name] = fields[name][0]));

        if (imageUploadPromise) {
            imageUploadPromise.then(function (fileName: string) {
                fields.img_src = fileName;
                console.log(fileName);
                updateOrCreate();
            }).catch(function (error) {
                console.error(error);
            })
        } else updateOrCreate();

        function updateOrCreate() {
            let product: Promise<any> = fields.id ? Product.update(fields, { where: { id: fields.id } }) : Product.create(fields);
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
    },

    find: function (req: Request, res: Response, next: NextFunction) {
        let input =
            req.body.input || res.locals.formInput || req.params.input || "";
        let options: object;
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

export { controller as productController }
export default controller
